import { db } from "@/lib/database/db-connect";
import { contactPerson } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const deleteCPController = async (contactId: string) => {
  if (!contactId) {
    return Response.json(
      {
        success: false,
        message: "Contact person id is required to perform this action.",
      },
      { status: 400 },
    );
  }
  // check exsting
  const existingCp = await db
    .select()
    .from(contactPerson)
    .where(eq(contactPerson.id, contactId))
    .limit(1);

  if (!existingCp.length) {
    return Response.json(
      {
        success: false,
        message: "Contact person not found.",
      },
      { status: 404 },
    );
  }
  // delete query
  await db.delete(contactPerson).where(eq(contactPerson.id, contactId));
  return Response.json(
    {
      success: true,
      message: `Contact person deleted successfully`,
    },
    { status: 200 },
  );
};
