import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import {
  postUser,
  postCustomer,
} from "@/app/api/panel/customers/postController";

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

    const body = await req.json().catch(() => null);

    if (!body) {
      return Response.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 },
      );
    }
    const type = body.type; // "user" | "customer"

    let result;

    if (type === "customer") {
      result = await postCustomer(body);
    } else {
      result = await postUser(body);
    }

    return Response.json(result.json, { status: result.status });
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

