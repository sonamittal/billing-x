import type { customer, customerOtherDetails } from "@/drizzle/schema";

// Drizzle inferred types
export type Customer = typeof customer.$inferSelect;

export type OtherDetails = typeof customerOtherDetails.$inferSelect;

// Because we are selecting only these fields in query
export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  banned: boolean | null;
  role: string | null;
  emailVerified: boolean;
  createdAt: Date;  
}

// response type
export interface GetCustomerById extends Customer {
  user: CustomerUser | null;
  otherDetails: OtherDetails | null;
}
