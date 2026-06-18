import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { putCPController } from "@/app/api/panel/customers/[customerId]/contact-person/[contactId]/putController";
import { deleteCPController } from "@/app/api/panel/customers/[customerId]/contact-person/[contactId]/deleteController";
// PUt req
export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ contactId: string }> },
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
    const { contactId } = await params;
    const body = await req.json();

    return putCPController(contactId, body);
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : `Failed to update contact person`,
      },
      { status: 500 },
    );
  }
};

// delete req
export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ contactId: string }> },
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
    const { contactId } = await params;
    return deleteCPController(contactId);
  } catch (error) {
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : `Failed to delete contact person`,
      },
      { status: 500 },
    );
  }
};
