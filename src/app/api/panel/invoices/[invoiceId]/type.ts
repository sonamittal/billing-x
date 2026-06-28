import { invoice, invoiceItem } from "@/drizzle/schema";

export type Invoice = typeof invoice.$inferSelect;
export type InvoiceItem = typeof invoiceItem.$inferSelect;