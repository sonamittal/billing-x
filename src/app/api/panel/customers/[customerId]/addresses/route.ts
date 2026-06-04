import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { getCAController } from "@/app/api/panel/customers/[customerId]/addresses/getController";
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
        { success: false, message: "Unauthorized - please login" },
        { status: 401 },
      );
    }
    const { customerId } = await params;
    return getCAController({ customerId });
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
