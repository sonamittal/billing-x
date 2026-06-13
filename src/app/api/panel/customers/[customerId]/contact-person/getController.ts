import { db } from "@/lib/database/db-connect";
import { eq } from "drizzle-orm";
import { contactPerson } from "@/drizzle/schema";
export const getCPController = async (customerId: string) => {
  const data = await db
    .select()
    .from(contactPerson)
    .where(eq(contactPerson.customerId, customerId));
  return Response.json(
    {
      success: true,
      data,
    },
    { status: 200 },
  );
};
