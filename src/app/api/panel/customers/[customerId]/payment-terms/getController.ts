import { db } from "@/lib/database/db-connect";
import { paymentTerms } from "@/drizzle/schema/index";

export const getPaymentTermsController = async (customerId: string) => {
  const data = await db.select().from(paymentTerms);
  return Response.json(
    {
      success: true,
      data,
      customerId,
    },
    { status: 200 },
  );
};
