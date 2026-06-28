import { getInvoiceById } from "@/app/api/panel/invoices/[invoiceId]/getController";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
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
