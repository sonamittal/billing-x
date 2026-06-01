import { db } from "@/lib/database/db-connect";
import { contactPerson } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const deleteCPController = async (contactId: string) => {
  try {
    const DeleteresData = await db
      .delete(contactPerson)
      .where(eq(contactPerson.id, contactId));
    return Response.json(
      {
        success: true,
        message: "Contact person deleted successfully",
        data: DeleteresData,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
};
