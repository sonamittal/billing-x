import { db } from "@/lib/database/db-connect";
import { contactPerson } from "@/drizzle/schema";
import { and, eq, ne } from "drizzle-orm";

export const putCPController = async (
  contactId: string,
  body: {
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    workPhone: string;
    mobile: string;
    designation: string;
    department: string;
  },
) => {
  try {
    // customer validation
    if (!contactId) {
      return Response.json(
        { success: false, message: `conatct id is required` },
        { status: 400 },
      );
    }
    // existing contact check
    const existingCustomerCP = await db.query.contactPerson.findFirst({
      where: (cp, { eq }) => eq(cp.id, contactId),
    });

    if (!existingCustomerCP) {
      return Response.json(
        {
          success: false,
          message: `Contact person not found`,
        },
        { status: 404 },
      );
    }
    // duplicate email check
    const email = body.email.trim().toLowerCase();

    const existingEmail = await db.query.contactPerson.findFirst({
      where: and(
        eq(contactPerson.email, email),
        ne(contactPerson.id, contactId),
      ),
    });

    if (existingEmail) {
      return Response.json(
        {
          success: false,
          message: `Email already exists`,
        },
        {
          status: 409,
        },
      );
    }
    // update query
    const res = await db
      .update(contactPerson)
      .set({
        ...body,
        email: body.email.trim().toLowerCase(),
        updatedAt: new Date(),
      })
      .where(eq(contactPerson.id, contactId))
      .returning();
    return Response.json(
      {
        success: true,
        message: `Contact person updated successfully`,
        data: res[0],
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || `internal  server error `,
      },
      { status: 500 },
    );
  }
};
