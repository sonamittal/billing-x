import { user } from "@/drizzle/schema/schema";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const customer = pgTable("customer", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  partnerType: text("partner_type").notNull(),
  displayName: text("display_name").notNull(),
  companyName: text("company_name"),
  currency: text("currency").notNull(),
  language: text("language").notNull(),
  country: text("country").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  pinCode: text("pin_code").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userCustomerRelations = relations(user, ({ one }) => ({
  customer: one(customer),
}));
export const customerRelations = relations(customer, ({ one }) => ({
  user: one(user, {
    fields: [customer.userId],
    references: [user.id],
  }),
}));
