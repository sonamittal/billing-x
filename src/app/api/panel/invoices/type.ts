import { invoice, invoiceItem } from "@/drizzle/schema";

export  type  NewInvoice  = typeof  invoice.$inferInsert;
export type NewInvoiceItem  = typeof invoiceItem.$inferInsert;