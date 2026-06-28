import { db } from "@/lib/database/db-connect";
import { invoice } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getInvoiceById = async (invoiceId: string) => {
  const invoiceData = await db.query.invoice.findFirst({
    where: eq(invoice.id, invoiceId),
    with: {
      customer: true,
      items: true,
    },
  });
  if (!invoiceData) {
    return Response.json(
      {
        success: false,
        message: "Invoice not found",
      },
      {
        status: 404,
      },
    );
  }
  return Response.json(
    {
      success: true,
      data: invoiceData,
    },
    {
      status: 200,
    },
  );
};
