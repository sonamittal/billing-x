import { db } from "@/lib/database/db-connect";
import { paymentTerms } from "@/drizzle/schema/index";

export const getPaymentTermsController = async (customerId: string) => {
  try {
    const data = await db.select().from(paymentTerms);
    return Response.json(
      {
        success: true,
        data,
        customerId,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error?.message || `Internal Server Error`,
      },
      { status: 500 },
    );
  }
};
