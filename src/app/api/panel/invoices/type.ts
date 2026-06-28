import { invoice, invoiceItem } from "@/drizzle/schema";

export type AddInvoice = typeof invoice.$inferInsert;
export type AddInvoiceItem = typeof invoiceItem.$inferInsert;
