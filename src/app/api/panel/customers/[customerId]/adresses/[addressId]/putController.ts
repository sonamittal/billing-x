import { db } from "@/lib/database/db-connect";
import { customerAddress } from "@/drizzle/schema";
import { and, eq, ne } from "drizzle-orm";
interface EditAddressBody {
  type: "billing" | "shipping";
  country: string;
  state: string;
  city: string;
  pinCode: string;
  address: {
    street1: string;
    street2: string;
  };
  phone: string;
}

interface PutCAControllerParams {
  customerId: string;
  addressId: string;
  body: EditAddressBody;
}
export const putCAController = async ({
  customerId,
  addressId,
  body,
}: PutCAControllerParams) => {
  try {
    if (!addressId) {
      return Response.json(
        { success: false, message: "address id is required" },
        { status: 400 },
      );
    }
    // exsiting address check
    const existingAddress = await db.query.customerAddress.findFirst({
      where: and(
        eq(customerAddress.id, addressId),
        eq(customerAddress.customerId, customerId),
      ),
    });
    if (!existingAddress) {
      return Response.json(
        {
          success: false,
          message: "Address not found",
        },
        { status: 404 },
      );
    }
    // update query
    const response = await db
      .update(customerAddress)
      .set({
        type: body.type,
        country: body.country,
        state: body.state,
        city: body.city,
        pinCode: body.pinCode,
        street1: body.address.street1,
        street2: body.address.street2,
        phone: body.phone,
      })
      .where(
        and(
          eq(customerAddress.id, addressId),
          eq(customerAddress.customerId, customerId),
        ),
      )
      .returning();
    return Response.json(
      {
        success: true,
        message: "Address updated successfully",
        data: response[0],
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      { success: false, message: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
};
