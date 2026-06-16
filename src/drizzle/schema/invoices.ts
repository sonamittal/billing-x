import { customer } from "@/drizzle/schema/customer";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const invoice = pgTable("invoice", {
  id: text("id").primaryKey(),

  customerId: text("customer_id")
    .notNull()
    .references(() => customer.id, {
      onDelete: "cascade",
    }),

  invoiceNumber: text("invoice_number").notNull().unique(),

  orderNumber: text("order_number").notNull(),

  invoiceDate: timestamp("invoice_date", {
    mode: "date",
  }).notNull(),

  dueDate: timestamp("due_date", {
    mode: "date",
  }),

  paymentDate: timestamp("payment_date", {
    mode: "date",
  }),

  subject: text("subject"),

  attachments: jsonb("attachments").$type<
    {
      url: string;
      key: string;
      name?: string;
    }[]
  >(),

  subtotal: integer("subtotal").notNull().default(0),

  discount: integer("discount").notNull().default(0),

  totalAmount: integer("total_amount").notNull().default(0),

  status: text("status")
    .$type<"draft" | "sent" | "unpaid" | "paid">()
    .notNull()
    .default("draft"),

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

  description: text("description"),

  unit: text("unit"),

  quantity: integer("quantity").default(1).notNull(),

  rate: integer("rate").notNull(),

  amount: integer("amount").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invoiceRelations = relations(invoice, ({ one, many }) => ({
  customer: one(customer, {
    fields: [invoice.customerId],
    references: [customer.id],
  }),
  items: many(invoiceItem),
}));

export const invoiceItemRelations = relations(invoiceItem, ({ one }) => ({
  invoice: one(invoice, {
    fields: [invoiceItem.invoiceId],
    references: [invoice.id],
  }),
}));
