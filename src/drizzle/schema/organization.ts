import { user } from "@/drizzle/schema/schema";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const organization = pgTable("organization", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  country: text("country").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  currency: text("currency").notNull(),
  language: text("language").notNull(),
  timezone: text("timezone").notNull(),
  gstRegistered: boolean("gst_registered").notNull().default(false),
  gstNumber: text("gst_number"),
  invoicingMethod: text("invoicing_method").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const organizationRelations = relations(organization, ({ one }) => ({
  user: one(user, {
    fields: [organization.userId],
    references: [user.id],
  }),
}));
