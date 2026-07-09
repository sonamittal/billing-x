import {
  invoice,
  invoiceItem,
  customer,
  invoicePayment,
} from "@/drizzle/schema";

export type Invoice = typeof invoice.$inferSelect;

export type InvoiceItem = typeof invoiceItem.$inferSelect;

export type Customer = typeof customer.$inferSelect;

export type InvoicePayment = typeof invoicePayment.$inferSelect;

export type invoiceWithRelations = Invoice & {
  items: InvoiceItem[];
  customer: Customer | null;
  payments: InvoicePayment[];
};
