import { db } from "@/lib/database/db-connect";
import { customer } from "@/drizzle/schema/index";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { eq } from "drizzle-orm";

export const GET = async (
  req: Request,
  { params }: { params: { customerId: string } },
) => {
  try {
    // checking session
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session?.user?.id) {
      return Response.json(
        { error: `Please sign in to access this content.` },
        { status: 401 },
      );
    }

    const { customerId } = await params;
    // Checking for cusid >>>>>>>>>>>>>>
    if (!customerId) {
      return Response.json(
        { error: `Customer id is required` },
        { status: 400 },
      );
    }
    //  Database query
    const customerData = await db
      .select()
      .from(customer)
      .where(eq(customer.id, customerId))
      .limit(1);
    // First row
    const customerRow = customerData[0];
    if (!customerRow) {
      return Response.json({ error: `customer not found.` }, { status: 404 });
    }
    // Success response
    return Response.json(customerRow, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? `Fetching customer failed. ${error}`
            : "Fetching customer failed.",
      },
      { status: 500 },
    );
  }
};
