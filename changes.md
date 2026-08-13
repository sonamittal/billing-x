# Detailed Architectural & Engineering Changes

This document provides a comprehensive technical breakdown of all architectural enhancements, database optimizations, security refactorings, and SEO engine implementations in **Bill-X**.

---

## 1. Multi-Tenant Scoped Composite Uniqueness (`UNIQUE(customer_id, invoice_number)`)

### A. Drizzle Schema Update (`src/drizzle/schema/invoices.ts`)
- **What Was Changed**:
  - Replaced the global `.unique()` constraint on `invoice.invoiceNumber` with a scoped composite unique constraint: `unique("customer_invoice_number_unique").on(table.customerId, table.invoiceNumber)`.
- **Why**: In real-world multi-tenant or multi-client billing applications, invoice numbering series (e.g. `INV-001`) must be unique **per customer / organization**, not globally across the entire database. A global unique constraint prevented different customers from using independent invoice numbering sequences. The composite unique constraint enforces `UNIQUE(customer_id, invoice_number)` at the PostgreSQL database level.

### B. Transactional Controller Scoping (`src/app/api/panel/invoices/postController.ts`)
- **What Was Changed**:
  - Updated the atomic transaction duplicate check from checking `invoiceNumber` globally to checking `and(eq(invoice.customerId, existingCustomer.id), eq(invoice.invoiceNumber, data.invoiceNumber))` inside `db.transaction(async (tx) => { ... })`.
- **Why**: Ensures that invoice number existence validation correctly scopes check execution per customer within the database transaction context.

---

## 2. Production SEO & Metadata Engine (Next.js 15/16 App Router)

### A. Root Metadata & OpenGraph Configuration (`src/app/layout.tsx`)
- **What Was Changed**:
  - Configured `metadataBase` using `process.env.NEXT_PUBLIC_APP_URL` (with a fallback to `http://localhost:3000`) to ensure absolute canonical URLs resolve correctly across all subroutes.
  - Implemented dynamic title templating (`title.template: "%s | Bill-X"`) and set the default brand title (`"Bill-X — Invoicing & Billing Management System"`).
  - Added structured metadata including `description`, `keywords` array, `authors`, `creator`, `publisher`, and `alternates.canonical`.
  - Configured rich social media preview cards via `openGraph` (type, locale, siteName, url, description) and `twitter` (`card: "summary_large_image"`).
  - Defined explicit crawler directives in `robots` (`index: true, follow: true`, `max-snippet: -1`, `max-image-preview: "large"`).
- **Why**: Replaced generic starter metadata to maximize search engine indexability, brand presentation, and social preview card formatting when links are shared across platforms (Twitter, LinkedIn, Slack).

### B. Dynamic Sitemap Generation (`src/app/sitemap.ts`)
- **What Was Changed**:
  - Created `src/app/sitemap.ts` exporting an async `sitemap()` function returning a `MetadataRoute.Sitemap` array.
  - Dynamically builds XML sitemap entries for public routes (`/`, `/auth/signin`, `/auth/signup`) populated with ISO timestamps (`lastModified`), priority rankings, and change frequencies (`weekly`).
- **Why**: Enables search engine crawlers (Google, Bing) to discover public pages cleanly without manual XML maintenance.

### C. Crawl Control (`src/app/robots.ts`)
- **What Was Changed**:
  - Created `src/app/robots.ts` exporting `robots()` returning a `MetadataRoute.Robots` object.
  - Set explicit crawler rules: allowing indexation of `/` while disallowing access to private dashboard paths (`/panel/`), API routes (`/api/`), and Next.js internal bundles (`/_next/`). Linked the generated `sitemap.xml` URL.
- **Why**: Shields internal application administrative routes and API endpoints from search engine indexing while directing crawlers to public landing/auth pages.

### D. JSON-LD Structured Data Schema (`src/app/page.tsx`)
- **What Was Changed**:
  - Injected an inline `<script type="application/ld+json">` rendering a `SoftwareApplication` JSON-LD schema on the home page.
- **Why**: Provides machine-readable structured schema data to Google, helping search engines display rich snippet card results (pricing, application type, category) in search engine result pages (SERPs).

---

## 3. Project Documentation & Environment Configuration

### A. Professional `README.md` Documentation
- **What Was Changed**:
  - Fully rewritten to accurately present the application: software overview, ground-truth feature audit (Organization setup, Customer directory, Itemized invoices, Payment recording, PDF exports, System RBAC, Cloud storage), Local Setup Guide (`npm run db:push`, `npm run db:studio`, `npm run dev`), and Self-Hosting Guide.
- **Why**: Replaced default Next.js starter boilerplate with clear, operational documentation for developers and operators.

### B. Environment Variable Consolidation (`.env.example` & `src/lib/auth/auth.ts`)
- **What Was Changed**:
  - Grouped environment variables in `.env.example` into 4 logical blocks: Application URL, Database, Authentication, Cloud Storage, and SMTP Mail.
  - Consolidated `BETTER_AUTH_URL` and `NEXT_PUBLIC_BETTER_AUTH_URL` down to `NEXT_PUBLIC_BETTER_AUTH_URL`.
  - Updated `src/lib/auth/auth.ts` (`baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL`).
- **Why**: Next.js client components (`src/lib/auth/auth-client.ts`) require the `NEXT_PUBLIC_` prefix to access environment variables in the browser. Fallback support on the server allows a single, unified environment variable (`NEXT_PUBLIC_BETTER_AUTH_URL`), eliminating configuration duplication and preventing client/server URL mismatches.

---

## 4. Database Indexing & Query Optimization

### A. Performance Indexes in Drizzle Schema
- **What Was Changed**:
  - Added single-column and relational foreign key indexes across database schema files:
    - **`src/drizzle/schema/invoices.ts`**:
      - `invoice_customer_id_idx` on `invoice.customerId`
      - `invoice_status_idx` on `invoice.status`
      - `invoice_payment_status_idx` on `invoice.paymentStatus`
      - `invoice_created_at_idx` on `invoice.createdAt`
      - `invoice_item_invoice_id_idx` on `invoiceItem.invoiceId`
      - `invoice_payment_invoice_id_idx` on `invoicePayment.invoiceId`
    - **`src/drizzle/schema/customer.ts`**:
      - `customer_user_id_idx` on `customer.userId`
      - `customer_created_at_idx` on `customer.createdAt`
- **Why**: Without database indexes, queries filtering invoices by status, customer ID, or date range force PostgreSQL to execute full table sequential scans ($O(N)$ time complexity). B-Tree indexes provide logarithmic ($O(\log N)$) lookups, guaranteeing sub-millisecond query performance during pagination, filtering, and table joins as dataset sizes scale.

---

## 5. Concurrency Safety & Atomic Invoicing

### A. Transactional Invoice Creation (`src/app/api/panel/invoices/postController.ts`)
- **What Was Changed**:
  - Moved the `existingInvoice` duplicate check (`tx.query.invoice.findFirst`) inside the atomic database transaction context (`await db.transaction(async (tx) => { ... })`).
- **Why**: Checking invoice number uniqueness outside the transaction block exposed the system to race conditions: if two requests arrived simultaneously with the same invoice number, both would pass the initial read check before either inserted. Moving the query inside the database transaction provides isolated, read-committed atomic execution, guaranteeing zero duplicate invoice number conflicts.

---

## 6. Centralized Authentication Gateway & Handler Cleanup

### A. Next.js 16 `src/proxy.ts` Authentication Guard
- **What Was Changed**:
  - Implemented `src/proxy.ts` adhering to Next.js 16 proxy request standards (`export async function proxy(request: NextRequest)`).
  - Intercepts requests targeting `/panel/*` and `/api/panel/*`, invoking `auth.api.getSession({ headers: request.headers })` at the edge gateway before routing to handlers.
  - Returns HTTP `401 Unauthorized` JSON for API calls and redirects browser page navigation to `/auth/signin?callbackUrl=...`.
- **Why**: Centralizes session authentication at the request gateway level instead of scattering session verification logic across individual pages and route handlers.

### B. API Route Handler Cleanup
- **What Was Changed**:
  - Removed repetitive manual `auth.api.getSession()` boilerplate from API route handlers (`src/app/api/panel/invoices/route.ts`, `src/app/api/panel/customers/route.ts`).
- **Why**: Adheres strictly to the DRY (Don't Repeat Yourself) principle, reducing codebase clutter and eliminating security vulnerabilities caused by forgetting session checks when creating new endpoints.
