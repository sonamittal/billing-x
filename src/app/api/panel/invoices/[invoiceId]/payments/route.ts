import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { putPaymentController } from "@/app/api/panel/invoices/[invoiceId]/payments/putController";
import { editInvoicePaymentSchema } from "@/components/validation/validation";
import { db } from "@/lib/database/db-connect";
import { invoice } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
type PaymentInput = z.infer<
  typeof editInvoicePaymentSchema
>["payments"][number];
// put req
export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return Response.json(
        {
          success: false,
          message: `Unauthorized - please login`,
        },
        { status: 401 },
      );
    }

    const { invoiceId } = await params;

    const body = await req.json();
    const bodyData = {
      ...body,
      payments: body.payments.map((payment: PaymentInput) => ({
        ...payment,
        paymentDate: new Date(payment.paymentDate),
      })),
      invoiceId,
    };
    const res = editInvoicePaymentSchema.parse(bodyData);
    return await putPaymentController(invoiceId, res);
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : `Failed to edit invoice payment data`,
      },
      { status: 500 },
    );
  }
};
