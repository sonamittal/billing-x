import { invoice, invoiceItem, customer } from "@/drizzle/schema";

export type Invoice = typeof invoice.$inferSelect;

export type InvoiceItem = typeof invoiceItem.$inferSelect;

export type Customer = typeof customer.$inferSelect;

export type invoiceWithRelations = Invoice & {
  items: InvoiceItem[];
  customer: Customer | null;
};
