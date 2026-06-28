import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { postInvoice } from "@/app/api/panel/invoices/postController";
import { addInvoiceSchema } from "@/components/validation/validation";
import { getAllInvoices } from "@/app/api/panel/invoices/getController";

// get req
export const GET = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: `Unauthorized - please login` },
        { status: 401 },
      );
    }
    return await getAllInvoices();
  } catch (error) {
    return Response.json({
      success: false,
      message:
        error instanceof Error ? error.message : `failed to fetch invoice data`,
    });
  }
};
// post req
export const POST = async (req: Request) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: `Unauthorized - please login` },
        { status: 401 },
      );
    }
    const body = await req.json();
    const payload = {
      ...body,
      invoiceDate: new Date(body.invoiceDate),
      dueDate: new Date(body.dueDate),
    };

    const result = addInvoiceSchema.parse(payload);
    return await postInvoice(result);
  } catch (error) {
    return Response.json(
      {
        success: false,
        Message:
          error instanceof Error ? error.message : `failed to add invoice `,
      },
      { status: 500 },
    );
  }
};
