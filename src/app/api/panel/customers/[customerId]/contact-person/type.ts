import type { contactPerson } from "@/drizzle/schema";

export type ContactPerson = typeof contactPerson.$inferSelect;