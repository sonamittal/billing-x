import { db } from "@/lib/database/db-connect";
import { user } from "@/drizzle/schema/index";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const GET = async (
  req: Request,
  { params }: { params: { userId: string } },
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    // Checking sessions and applying logic from controller for each role
    if (!session || !session?.user?.id) {
      return Response.json(
        { error: `Please sign in to access this content.` },
        { status: 400 },
      );
    }
    const { userId } = await params;
    // Checking for required fields >>>>>>>>>>>>>>
    if (!userId) {
      return Response.json(
        { message: `User id is required to fetch user.` },
        { status: 400 },
      );
    }
    // fetch user from DB
    let userData = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    const userRow = userData[0];
    if (!userRow) {
      return Response.json({ error: `User not found.` }, { status: 400 });
    }
    // Returning user data >>>>>>>>>>>>>>
    return Response.json({ ...userRow }, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        error: `Fetching user failed. ${process.env.NODE_ENV == "development" ? error : ""}`,
      },
      { status: 400 },
    );
  }
};
