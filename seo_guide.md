# Next.js 15/16 SEO & Metadata Setup Guide for Bill-X

This guide provides a comprehensive, production-ready blueprint for implementing search engine optimization (SEO), Open Graph metadata, dynamic sitemaps, robots rules, and structured data in **Bill-X** using the latest Next.js App Router standards.

---

## 1. Core Principles & Architecture

Next.js 15/16 uses the **Metadata API** inside the `app/` router directory. Instead of legacy `<head>` tags, metadata is defined declaratively using:
- **Static Metadata**: Exporting a `metadata: Metadata` object in `layout.tsx` or `page.tsx`.
- **Dynamic Metadata**: Exporting `generateMetadata()` for pages dependent on dynamic parameters.
- **Route Handlers**: Built-in file conventions (`sitemap.ts`, `robots.ts`, `manifest.ts`).

---

## 2. Root Layout Metadata (`src/app/layout.tsx`)

Set up global SEO default values, title templates, Open Graph social share cards, and canonical base URLs in `src/app/layout.tsx`.

```typescript
import type { Metadata, Viewport } from "next";

// Base URL for resolving relative images and canonical tags
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://billing.example.com";

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Bill-X — Invoicing & Billing Management System",
    template: "%s | Bill-X",
  },
  description:
    "Bill-X is a full-stack invoicing, billing management, and payment tracking platform designed for businesses, freelancers, and enterprises.",
  keywords: [
    "invoicing software",
    "billing management",
    "payment tracking",
    "PDF invoice generator",
    "customer management",
    "Drizzle ORM billing",
    "Next.js invoicing system",
  ],
  authors: [{ name: "Bill-X Team" }],
  creator: "Bill-X",
  publisher: "Bill-X",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    title: "Bill-X — Invoicing & Billing Management System",
    description:
      "Streamline invoice creation, customer directories, payment tracking, and PDF exports effortlessly with Bill-X.",
    siteName: "Bill-X",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bill-X Dashboard & Invoicing Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bill-X — Invoicing & Billing Management System",
    description:
      "Manage customer billing, create PDF invoices, and track payments seamlessly.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};
```

---

## 3. Dynamic Sitemap Generation (`src/app/sitemap.ts`)

Next.js generates a dynamic `/sitemap.xml` automatically when `sitemap.ts` is created in `src/app/`.

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://billing.example.com";

  // Static public routes
  const routes = [
    "",
    "/auth/signin",
    "/auth/signup",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...routes];
}
```

---

## 4. Crawl Control (`src/app/robots.ts`)

Define `/robots.txt` rules using `src/app/robots.ts` to allow search engine indexing on public pages while blocking private internal application routes (`/panel/` and `/api/`).

```typescript
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://billing.example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/panel/", "/api/", "/_next/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## 5. Dynamic Page Metadata (`generateMetadata`)

For dynamic pages (e.g. dynamic invoice templates, public customer links), export `generateMetadata`:

```typescript
// src/app/(pages)/invoices/[id]/page.tsx
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  // Fetch invoice title or customer name
  const invoiceTitle = `Invoice #${id}`;

  return {
    title: invoiceTitle,
    description: `View details and payment status for ${invoiceTitle}.`,
    openGraph: {
      title: `${invoiceTitle} | Bill-X`,
      description: `Invoice details and payment details for ${invoiceTitle}.`,
    },
  };
}
```

---

## 6. Structured Data (JSON-LD)

To display rich snippet card results in Google search results, inject a JSON-LD `SoftwareApplication` schema script tag inside `src/app/page.tsx`:

```tsx
// src/app/page.tsx
export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bill-X",
    operatingSystem: "Web-based",
    applicationCategory: "BusinessApplication",
    description:
      "Full-stack invoicing, billing management, and payment tracking application.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page Content */}
    </>
  );
}
```

---

## 7. Checklist for Production SEO Readiness

- [ ] Set `NEXT_PUBLIC_APP_URL` in production environment variables (e.g., `https://your-domain.com`).
- [ ] Add `og-image.png` (1200x630px) in `public/` directory for social media previews.
- [ ] Verify `https://your-domain.com/sitemap.xml` generates valid XML output.
- [ ] Verify `https://your-domain.com/robots.txt` disallows `/panel/` and `/api/`.
- [ ] Ensure all images (`next/image`) include meaningful `alt` descriptive attributes.
