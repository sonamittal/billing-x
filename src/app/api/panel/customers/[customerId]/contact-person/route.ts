import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { postCPController } from "@/app/api/panel/customers/[customerId]/contact-person/postController";
// post req
export const POST = async (req: Request) => {
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
    const body = await req.json();
    return await postCPController(body);
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
