import { db } from "@/lib/database/db-connect";
import { customer, user } from "@/drizzle/schema/index";
import { ilike, eq } from "drizzle-orm";

export const getCustomers = async (username?: string) => {
  const data = await db
    .select({
      id: customer.id,
      userId: customer.userId,
      // from user table
      username: user.name,
      email: user.email,
      image: user.image,
      phone: user.phone_no,
      // from customer table
      companyName: customer.companyName,
    })
    .from(customer)
    .leftJoin(user, eq(customer.userId, user.id))
    .where(username ? ilike(user.name, `%${username}%`) : undefined);
  return data;
};
