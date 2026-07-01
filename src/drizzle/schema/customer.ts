import { user } from "@/drizzle/schema/schema";
import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  json,
  unique,
  pgEnum,
} from "drizzle-orm/pg-core";
import { invoice, invoicePayment } from "@/drizzle/schema/invoices";

export const customerTypeEnum = pgEnum("customer_type", [
  "individual",
  "business",
]);

export const customer = pgTable("customer", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  customerType: customerTypeEnum("customer_type").notNull(),
  companyName: text("company_name"),
  currency: text("currency").notNull(),
  language: text("language").notNull(),
  // billing address
  countryId: text("country_id").notNull(),
  country: text("country").notNull(),
  stateId: text("state_id").notNull(),
  state: text("state").notNull(),
  cityId: text("city_id").notNull(),
  city: text("city").notNull(),
  pinCode: text("pin_code").notNull(),
  street1: text("street_1").notNull(),
  street2: text("street_2"),
  // Primary Contact
  // salutation: text("salutation"),
  // firstName: text("first_name"),
  // lastName: text("last_name"),
  email: text("email"),
  workPhone: text("work_phone"),
  mobile: text("mobile"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
// payment terms
export const paymentTerms = pgTable("payment_terms", {
  id: text("id").primaryKey(),
  termName: text("term_name").notNull(),
  // number of days after invoice date
  dueAfter: integer("due_after").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// other details
export const customerOtherDetails = pgTable("customer_other_details", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .unique()
    .references(() => customer.id, { onDelete: "cascade" }),
  pan: text("pan"),
  paymentTermId: text("payment_term_id").references(() => paymentTerms.id, {
    onDelete: "set null",
  }),
  documents:
    json("documents").$type<{ url: string; key: string; name?: string }[]>(),
  websiteUrl: text("website_url"),
  department: text("department"),
  designation: text("designation"),
  x: text("x"),
  facebook: text("facebook"),
  // remarks
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// address
// export const customerAddress = pgTable("customer_address", {
//   id: text("id").primaryKey(),
//   customerId: text("customer_id")
//     .notNull()
//     .references(() => customer.id, { onDelete: "cascade" }),
//   // type: text("type").notNull(), // billing | shipping
//   country: text("country"),
//   state: text("state"),
//   city: text("city"),
//   pinCode: text("pin_code"),
//   street1: text("street_1"),
//   street2: text("street_2"),
//   phone: text("phone"),
// });
// contact person
export const contactPerson = pgTable(
  "contact_person",
  {
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
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("customer_email_unique").on(table.customerId, table.email),
  ],
);

export const userCustomerRelations = relations(user, ({ one }) => ({
  customer: one(customer),
}));

export const customerRelations = relations(customer, ({ many, one }) => ({
  user: one(user, {
    fields: [customer.userId],
    references: [user.id],
  }),
  contacts: many(contactPerson),
  otherDetails: one(customerOtherDetails),
  invoices: many(invoice),
  payments: many(invoicePayment),
}));

// payment terms relations
export const paymentTermsRelations = relations(paymentTerms, ({ many }) => ({
  customerOtherDetails: many(customerOtherDetails),
}));

export const customerOtherDetailsRelations = relations(
  customerOtherDetails,
  ({ one }) => ({
    customer: one(customer, {
      fields: [customerOtherDetails.customerId],
      references: [customer.id],
    }),

    paymentTerm: one(paymentTerms, {
      fields: [customerOtherDetails.paymentTermId],
      references: [paymentTerms.id],
    }),
  }),
);
