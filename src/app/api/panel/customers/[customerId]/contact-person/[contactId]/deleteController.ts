import { db } from "@/lib/database/db-connect";
import { contactPerson } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const deleteCPController = async (contactId: string) => {
  try {
    if (!contactId) {
      return Response.json(
        { error: `Contact person id is required to perform this action.` },
        { status: 400 },
      );
    }
    // check exsting
    const exstingCp = await db
      .select()
      .from(contactPerson)
      .where(eq(contactPerson.id, contactId))
      .limit(1);
    if (!exstingCp.length) {
      return Response.json(
        { error: `Contact person is not fond.` },
        { status: 400 },
      );
    }
    // delete query
    const DeleteresData = await db
      .delete(contactPerson)
      .where(eq(contactPerson.id, contactId));
    return Response.json(
      {
        success: true,
        message: `Contact person deleted successfully`,
        data: DeleteresData,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || `Internal Server Error`,
      },
      { status: 500 },
    );
  }
};
