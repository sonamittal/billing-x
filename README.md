# Bill-X — Billing & Invoice Management System

Bill-X is a web application built for managing organization setup, customer directories, itemized invoices, payment tracking, and PDF billing exports.

---

## 🌟 What This Project Is

Bill-X provides a structured platform to manage business billing workflows from initial organization onboarding to client invoicing and payment recording.

### Features & Capabilities

- **Organization Setup**:
  - Configure business profiles including industry, address, currency, timezone, invoicing methods, and GST registration details.

- **Customer Management**:
  - Support for Business and Individual customer profiles.
  - Track primary contacts, billing addresses, tax IDs (PAN), website URLs, social handles, and attached documents.

- **Invoice Creation & Lifecycle**:
  - Generate and edit itemized invoices with custom line items (rate, quantity, unit, amount), subtotal calculations, and discounts.
  - Automatic invoice number generation and conversion of total amounts into words.
  - Maintain invoice status (`draft` | `sent`) and customer notes & terms.

- **Payment Recording**:
  - Log partial and full payments against issued invoices.
  - Record payment modes (Bank Transfer, Cash, Card, Online) and payment dates.
  - Automated invoice status updates (`unpaid`, `partially_paid`, `paid`).

- **PDF Generation & Export**:
  - In-browser preview and downloadable PDF invoice generation using React-PDF templates.

- **User Management & Access Control**:
  - Create and manage team members within the platform.
  - User password management and system role access control (`admin`, `staff`, `staffAssigned`, `timesheetStaff`).

- **Cloud Storage & Email Delivery**:
  - Cloudflare R2 / S3 integration for logo and customer document uploads.
  - SMTP email integration for sending verification codes and system notifications.

---

## 💻 Local Setup Guide

Follow these steps to set up and run Bill-X on your local machine.

### Prerequisites

- **Node.js**: v20.0.0 or higher
- **Package Manager**: npm (or pnpm / yarn / bun)
- **PostgreSQL**: Running instance (Local or hosted service like Neon / Supabase)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/billing-x.git
cd billing-x
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env
```

Update the `DATABASE_URL` with your local or remote PostgreSQL connection string, and set your authentication and storage credentials as needed.

### 3. Push Database Schema

Run Drizzle Kit to apply schema migrations to your PostgreSQL database:

```bash
npm run db:push
```

To open a visual database editor:

```bash
npm run db:studio
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Self-Hosting & Deployment Guide

### 1. Database Provisioning

Provision a PostgreSQL database and configure the environment variable:

```env
DATABASE_URL="postgresql://user:password@your-db-host:5432/billing_x"
```

Apply the schema to your production database:

```bash
npx drizzle-kit push
```

### 2. Storage Setup (Cloudflare R2 / AWS S3)

Set up a Cloudflare R2 or AWS S3 bucket for file attachments:

1. Create a bucket and enable CORS access for your domain.
2. Update the environment variables in `.env`:
   ```env
   CLOUDFLARE_R2_ACCOUNT_ID="your-account-id"
   CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key-id"
   CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-key"
   CLOUDFLARE_R2_BUCKET_NAME="your-bucket-name"
   CLOUDFLARE_R2_PUBLIC_ENDPOINT="https://your-r2-public-domain.com"
   ```

### 3. SMTP Mail Service Setup

Configure your SMTP email server for sending authentication and verification emails:

```env
SMTP_HOST="smtp.yourprovider.com"
SMTP_PORT=587
SMTP_SECURE="false"
SMTP_USER="your-smtp-username"
SMTP_PASSWORD="your-smtp-password"
```

### 4. Build and Run Production Application

```bash
# Build production bundle
npm run build

# Start production server
npm run start
```

Ensure `NEXT_PUBLIC_BETTER_AUTH_URL` is configured to match your live production domain (e.g., `https://billing.yourdomain.com`).

---

## 📜 Available Scripts

- `npm run dev` — Starts Next.js development server
- `npm run build` — Builds the application for production
- `npm run start` — Starts Next.js production server
- `npm run db:push` — Synchronizes Drizzle schema with PostgreSQL database
- `npm run db:studio` — Opens Drizzle Studio database UI
- `npm run lint` — Runs ESLint for code analysis
