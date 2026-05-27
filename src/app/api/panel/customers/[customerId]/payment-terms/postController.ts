import { db } from "@/lib/database/db-connect";
import { nanoid } from "nanoid";
import {
  paymentTerms,
} from "@/drizzle/schema/index";

export const addPaymentTermController = async (body: any) => {
  try {
    const { termName, dueAfter } = body;
   if (!termName || !dueAfter) {
  return Response.json(
    { success: false, message: "All fields are required" },
    { status: 400 }
  );
}
    const resData = await db
      .insert(paymentTerms)
      .values({
        id: nanoid(),
        termName,
        dueAfter,
      })
      .returning();
    return Response.json(
      {
        success: true,
        message: "Payment term added successfully",
        data: resData[0],
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
