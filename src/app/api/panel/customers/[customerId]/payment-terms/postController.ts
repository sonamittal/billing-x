import { db } from "@/lib/database/db-connect";
import { nanoid } from "nanoid";
import { paymentTerms } from "@/drizzle/schema/index";
interface AddPaymentTermBody {
  termName: string;
  dueAfter: number;
}
export const addPaymentTermController = async (body: AddPaymentTermBody) => {
  const { termName, dueAfter } = body;

  if (!termName || dueAfter === undefined || dueAfter === null) {
    return Response.json(
      {
        success: false,
        message: "All fields are required",
      },
      { status: 400 },
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
      message: `Payment term added successfully`,
      data: resData[0],
    },
    { status: 200 },
  );
};
