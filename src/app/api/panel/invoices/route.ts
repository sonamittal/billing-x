import { postInvoice } from "@/app/api/panel/invoices/postController";
import { addInvoiceSchema } from "@/components/validation/validation";
import { getAllInvoices } from "@/app/api/panel/invoices/getController";
import { invoicesQuerySchema } from "@/app/api/panel/invoices/getController";

export const GET = async (req: Request) => {
  try {
    const { searchParams: rawSearchParams } = new URL(req.url);
    const res = invoicesQuerySchema.safeParse(
      Object.fromEntries(rawSearchParams.entries()),
    );

    if (!res.success) {
      console.log("FFFF", Object.fromEntries(rawSearchParams.entries()));
      return Response.json(
        {
          message: "invalid invoices query data",
          error: res.error,
        },
        { status: 400 },
      );
    }

    const {
      status,
      paymentStatus,
      invoiceNumber,
      page,
      perPage,
      sortBy,
      sortOrder,
    } = res.data;

    return await getAllInvoices({
      status,
      paymentStatus,
      invoiceNumber,
      page,
      perPage,
      sortBy,
      sortOrder,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "failed to fetch invoice data",
      },
      { status: 500 },
    );
  }
};
// post req
export const POST = async (req: Request) => {
  try {
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
        message:
          error instanceof Error ? error.message : `failed to add invoice`,
      },
      { status: 500 },
    );
  }
};
