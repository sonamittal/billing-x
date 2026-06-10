import { db } from "@/lib/database/db-connect";
import { customer } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const deleteCusController = async (customerId: string) => {
  try {
    if (!customerId) {
      return Response.json(
        { error: `Contact person id is required to perform this action.` },
        { status: 400 },
      );
    }
    // check exsting
    const existingCustomer = await db
      .select()
      .from(customer)
      .where(eq(customer.id, customerId))
      .limit(1);
    if (!existingCustomer.length) {
      return Response.json({ error: `Customer not found.` }, { status: 400 });
    }
    // db query
    const res = await db.delete(customer).where(eq(customer.id, customerId));
    return Response.json(
      {
        success: true,
        message: `Customer deleted successfully`,
        data: res,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || `Internal Server Error`,
      },
      { status: 500 },
    );
  }
};
