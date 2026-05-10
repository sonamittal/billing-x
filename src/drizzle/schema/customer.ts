import { user } from "@/drizzle/schema/schema";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const customer = pgTable("customer", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  customerType: text("customer_type").notNull(),
  companyName: text("company_name"),
  currency: text("currency").notNull(),
  language: text("language").notNull(),
  country: text("country").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  pinCode: text("pin_code").notNull(),
  address: text("address").notNull(),
  // Primary Contact
  salutation: text("salutation"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  workPhone: text("work_phone"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
// address
export const customerAddress = pgTable("customer_address", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customer.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // billing | shipping
  country: text("country"),
  state: text("state"),
  city: text("city"),
  pinCode: text("pin_code"),
  street1: text("street_1"),
  street2: text("street_2"),
  phone: text("phone"),
});
// contact person
export const contactPerson = pgTable("contact_person", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customer.id, { onDelete: "cascade" }),
  salutation: text("salutation"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  workPhone: text("work_phone"),
  mobile: text("mobile"),
  designation: text("designation"),
  department: text("department"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userCustomerRelations = relations(user, ({ one }) => ({
  customer: one(customer),
}));
export const customerRelations = relations(customer, ({ many, one }) => ({
  user: one(user, {
    fields: [customer.userId],
    references: [user.id],
  }),
  contacts: many(contactPerson),
  addresses: many(customerAddress),
}));
