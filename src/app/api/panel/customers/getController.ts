import { db } from "@/lib/database/db-connect";
import { customer, user } from "@/drizzle/schema/index";
import { ilike, eq, and } from "drizzle-orm";

export interface GetCustomers {
  id: string;
  userId: string;
  companyName: string | null;
  mobile: string | null;
  email: string | null;
  user: {
    name: string;
    image: string | null;
  } | null;
}
export const getCustomers = async (name?: string): Promise<GetCustomers[]> => {
  const data = await db
    .select({
      id: customer.id,
      userId: customer.userId,
      // from customer table
      companyName: customer.companyName,
      mobile: customer.mobile,
      email: customer.email,
      // from user table
      user: {
        name: user.name,
        image: user.image,
      },
    })
    .from(customer)
    .leftJoin(user, eq(customer.userId, user.id))
    .where(and(name ? ilike(user.name, `%${name}%`) : undefined));
  return data;
};

