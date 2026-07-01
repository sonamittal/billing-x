import { invoice, invoiceItem } from "@/drizzle/schema";

export type AddInvoice = typeof invoice.$inferInsert;
export type AddInvoiceItem = typeof invoiceItem.$inferInsert;

export type EditInvoice = typeof invoice.$inferInsert;
export type EditInvoiceItem = typeof invoiceItem.$inferInsert;
