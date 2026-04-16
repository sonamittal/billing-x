import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import {
  postUser,
  postCustomer,
} from "@/app/api/panel/customers/postController";
import { getCustomers } from "@/app/api/panel/customers/getController";

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
        { success: false, message: "Invalid data" },
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

// get request
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username") || undefined;
    const data = await getCustomers(username);
    return Response.json(data);
  } catch (error: any) {
    return Response.json(
      { message: error.message || "Failed to fetch customers" },
      { status: 500 },
    );
  }
}
