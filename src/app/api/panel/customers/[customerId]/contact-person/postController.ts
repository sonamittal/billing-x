import { db } from "@/lib/database/db-connect";
import { contactPerson } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
export const postCPController = async (body: {
  customerId: string;
  contacts: {
    salutation: string;
    firstName: string;
    lastName: string;
    email: string;
    workPhone: string;
    mobile: string;
    designation: string;
    department: string;
  }[];
}) => {
  const { customerId, contacts } = body;
  // customer validation
  if (!customerId) {
    return Response.json(
      { success: false, message: `Customer id is required` },
      { status: 400 },
    );
  }
  // contacts validation
  if (!contacts || contacts.length === 0) {
    return Response.json(
      {
        success: false,
        message: `At least one contact person is required`,
      },
      { status: 400 },
    );
  }

  // Duplicate emails
  const emails = contacts.map((contact) => contact.email.trim().toLowerCase());

  const duplicateEmails = emails.filter(
    (email, index) => emails.indexOf(email) !== index,
  );

  if (duplicateEmails.length > 0) {
    return Response.json(
      {
        success: false,
        message: `Duplicate emails found contact person `,
        emails: [...new Set(duplicateEmails)],
      },
      { status: 409 },
    );
  }

  // Existing contacts check
  const existingContacts = await db.query.contactPerson.findMany({
    where: and(
      eq(contactPerson.customerId, customerId),
      inArray(contactPerson.email, emails),
    ),
  });

  if (existingContacts.length > 0) {
    return Response.json(
      {
        success: false,
        message: `Some contact emails already exist`,
        emails: existingContacts.map((c) => c.email),
      },
      { status: 409 },
    );
  }

  // insert data
  const res = await db
    .insert(contactPerson)
    .values(
      contacts.map((contact) => ({
        id: nanoid(),
        customerId,
        ...contact,
        email: contact.email.trim().toLowerCase(),
      })),
    )
    .returning();

  return Response.json(
    {
      success: true,
      message: `Contact person added successfully`,
      data: res,
    },
    { status: 200 },
  );
};
