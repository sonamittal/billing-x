import type { Metadata } from "next";
import { Mona_Sans as FontSans, Syncopate } from "next/font/google";
import { cn } from "@/utils/index";
import "@/styles/globals.css";
import ThemeProvider from "@/providers/theme-provider";
import ReactQueryProvider from "@/providers/react-query";
import BprogressProvider from "@/providers/bprogress";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
export const fontSans = FontSans({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontSyncopate = Syncopate({
  weight: ["400", "700"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-syncopate",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Bill-X — Invoicing & Billing Management System",
    template: "%s | Bill-X",
  },
  description:
    "Bill-X is an enterprise invoicing, billing management, and payment tracking platform designed for businesses, freelancers, and organizations.",
  keywords: [
    "invoicing software",
    "billing management",
    "payment tracking",
    "PDF invoice generator",
    "customer directory",
    "Drizzle ORM billing",
    "Next.js invoicing platform",
  ],
  authors: [{ name: "Bill-X Team" }],
  creator: "Bill-X",
  publisher: "Bill-X",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: appUrl,
    title: "Bill-X — Invoicing & Billing Management System",
    description:
      "Manage customer billing, create itemized PDF invoices, and track payments seamlessly with Bill-X.",
    siteName: "Bill-X",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bill-X — Invoicing & Billing Management System",
    description:
      "Manage customer billing, create itemized PDF invoices, and track payments seamlessly.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          fontSans.variable,
          fontSyncopate.variable,
        )}
      >
        <NuqsAdapter>
          <BprogressProvider>
            <ReactQueryProvider>
              <ThemeProvider>
                {children}
                <Toaster />
              </ThemeProvider>
            </ReactQueryProvider>
          </BprogressProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
