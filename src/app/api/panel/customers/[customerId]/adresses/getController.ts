import { db } from "@/lib/database/db-connect";
import { customerAddress } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";
interface GetCAControllerParam {
  customerId: string;
  //addressId: string;
}
export const getCAController = async ({ customerId }: GetCAControllerParam) => {
  try {
    const data = await db
      .select()
      .from(customerAddress)
      .where(eq(customerAddress.customerId, customerId));
    return Response.json(
      {
        success: true,
        data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error?.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
};
