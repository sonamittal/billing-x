"use client";
import ModernTemplate from "@/components/website/pages/invoices/pdf/templates/modern-template";
import type { Invoice } from "@/components/website/pages/invoices/pdf/type";

interface Props {
  template: "modern" | "classic" | "minimal";
  invoice: Invoice;
}
const InvoicePDF = ({ template, invoice }: Props) => {
  switch (template) {
    case "modern":
      return <ModernTemplate invoice={invoice} />;

    case "classic":
        return null;
    case "minimal":
       return null;

    default:
      return <ModernTemplate invoice={invoice} />;
  }
};

export default InvoicePDF