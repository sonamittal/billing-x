import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/database/db-connect";
import { organization } from "@/drizzle/schema/schema";
import { eq } from "drizzle-orm";

export const POST = async (req: Request) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    // check user logged in or not
    if (!session?.user?.id) {
      return Response.json(
        { message: "Organization created successfully" },
        { status: 201 },
      );
    }
    const body = await req.json();

    // check organization exists
    const existingOrg = await db.query.organization.findFirst({
      where: (org) => eq(org.userId, session.user.id),
    });
    if (existingOrg) {
      return Response.json(
        {message: "organization has already exist"},
        {status: 400,}
      );
    }
    // create organization
    const createOrganization = await db
      .insert(organization)
      .values({
        ...body,
        userId: session.user.id,
      })
      .returning();
    return Response.json(
      {message: "Organization created successfully"},
      {status: 201}
    );
  } catch (error) {
    return Response.json(
      {error: "failed to organization"},
      {status: 500},
    );
  }
};
