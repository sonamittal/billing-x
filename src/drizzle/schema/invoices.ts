import { customer } from "@/drizzle/schema/customer";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, numeric } from "drizzle-orm/pg-core";
import type { Unit, PaymentMode } from "@/drizzle/schema/type";

export const invoice = pgTable("invoice", {
  id: text("id").primaryKey(),

  customerId: text("customer_id")
    .notNull()
    .references(() => customer.id, {
      onDelete: "cascade",
    }),

  customerName: text("customer_name").notNull(),

  invoiceNumber: text("invoice_number").notNull().unique(),

  invoiceDate: timestamp("invoice_date", {
    mode: "date",
  }).notNull(),

  dueDate: timestamp("due_date", {
    mode: "date",
  }).notNull(),

  subject: text("subject"),

  // summary
  subtotal: numeric("subtotal", {
    precision: 10,
    scale: 2,
  }).notNull(),

  discount: numeric("discount", {
    precision: 10,
    scale: 2,
  }).notNull(),

  totalAmount: numeric("total_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),

  paymentStatus: text("payment_status")
    .$type<"unpaid" | "partially_paid" | "paid">()
    .default("unpaid")
    .notNull(),

  customerNotes: text("customer_notes").notNull(),

  termsAndConditions: text("terms_and_conditions").notNull(),

  status: text("status").$type<"draft" | "sent">().default("draft").notNull(),

  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    mode: "date",
  })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// invoice item
export const invoiceItem = pgTable("invoice_item", {
  id: text("id").primaryKey(),

  invoiceId: text("invoice_id")
    .notNull()
    .references(() => invoice.id, {
      onDelete: "cascade",
    }),

  itemName: text("item_name").notNull(),

  description: text("description").notNull(),

  unit: text("unit").$type<Unit>().notNull(),

  quantity: numeric("quantity", {
    precision: 10,
    scale: 2,
  }).notNull(),

  rate: numeric("rate", {
    precision: 10,
    scale: 2,
  }).notNull(),

  amount: numeric("amount", {
    precision: 10,
    scale: 2,
  }).notNull(),

  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    mode: "date",
  })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Invoce Payment
export const invoicePayment = pgTable("invoice_payment", {
  id: text("id").primaryKey(),

  invoiceId: text("invoice_id")
    .notNull()
    .references(() => invoice.id, {
      onDelete: "cascade",
    }),

  customerId: text("customer_id")
    .notNull()
    .references(() => customer.id, {
      onDelete: "cascade",
    }),

  amountReceived: numeric("amount_received", {
    precision: 10,
    scale: 2,
  }).notNull(),

  paymentMode: text("payment_mode").$type<PaymentMode>().notNull(),

  paymentDate: timestamp("payment_date", {
    mode: "date",
  }).notNull(),

  createdAt: timestamp("created_at", {
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});

export const invoiceRelations = relations(invoice, ({ one, many }) => ({
  customer: one(customer, {
    fields: [invoice.customerId],
    references: [customer.id],
  }),

  items: many(invoiceItem),

  payments: many(invoicePayment),
}));

export const invoiceItemRelations = relations(invoiceItem, ({ one }) => ({
  invoice: one(invoice, {
    fields: [invoiceItem.invoiceId],
    references: [invoice.id],
  }),
}));

export const invoicePaymentRelations = relations(invoicePayment, ({ one }) => ({
  invoice: one(invoice, {
    fields: [invoicePayment.invoiceId],
    references: [invoice.id],
  }),
  customer: one(customer, {
    fields: [invoicePayment.customerId],
    references: [customer.id],
  }),
}));
