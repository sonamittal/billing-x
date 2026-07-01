import { getInvoiceById } from "@/app/api/panel/invoices/[invoiceId]/getController";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { putInvoiceController } from "@/app/api/panel/invoices/[invoiceId]/putController";
import { editInvoiceSchema } from "@/components/validation/validation";

// get req
export const GET = async (
  _req: Request,
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
          message: "Unauthorized - please login",
        },
        {
          status: 401,
        },
      );
    }
    const { invoiceId } = await params;

    return await getInvoiceById(invoiceId);
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch invoice",
      },
      { status: 500 },
    );
  }
};

// pt req

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) => {
  try {
    // session check
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
      invoiceDate: new Date(body.invoiceDate),
      dueDate: new Date(body.dueDate),
    };

    const res = editInvoiceSchema.parse(bodyData);
    return await putInvoiceController(invoiceId, res);
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : `Failed to edit invoice data`,
      },
      { status: 500 },
    );
  }
};
