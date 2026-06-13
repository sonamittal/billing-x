import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { addPaymentTermController } from "@/app/api/panel/customers/[customerId]/payment-terms/postController";
import { getPaymentTermsController } from "@/app/api/panel/customers/[customerId]/payment-terms/getController";
// get req
export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ customerId: string }> },
) => {
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
    const { customerId } = await params;
    return  await getPaymentTermsController(customerId);
  } catch (error: unknown) {
    return Response.json(
      {
        success: false,
        message: `Failed to fetch payment term`
      },
      { status: 500 },
    );
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
    return await addPaymentTermController(body);
  } catch (error: unknown) {
    return Response.json(
      {
        success: false,
        message: `Failed to add payment term`,
      },
      { status: 500 },
    );
  }
};
