import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { postCPController } from "@/app/api/panel/customers/[customerId]/contact-person/postController";
import { getCPController } from "@/app/api/panel/customers/[customerId]/contact-person/getController";
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
    return await getCPController(customerId);
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : `failed to fetch Contact Person `,
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
    return await postCPController(body);
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : `failed to add Contact Person `,
      },
      { status: 500 },
    );
  }
};
