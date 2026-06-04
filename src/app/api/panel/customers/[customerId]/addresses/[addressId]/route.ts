import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { putCAController } from "@/app/api/panel/customers/[customerId]/addresses/[addressId]/putController";

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ customerId: string; addressId: string }> },
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "Unauthorized - please login" },
        { status: 401 },
      );
    }
    const { customerId, addressId } = await params;
    const body = await req.json();
    return putCAController({
      customerId,
      addressId,
      body,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error?.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
};
