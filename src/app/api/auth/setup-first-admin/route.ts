import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/database/db-connect";
import { user } from "@/drizzle/schema/index";
import { eq } from "drizzle-orm";
export const POST = async (req: Request) => {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return Response.json({ message: "userId is required" }, { status: 400 });
    }
    // check if any admin already exists
    const adminExist = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.role, "admin"),
    });
    if (adminExist) {
      return Response.json({
        message: "Admin already exists",
      });
    }
    try {
      // first  user
      await auth.api.setRole({
        headers: await headers(),
        body: {
          userId,
          role: "admin",
        },
      });
    } catch (error) {
      console.log("updated user data");
      await db.update(user).set({ role: "admin" }).where(eq(user.id, userId));
    }
    return Response.json({
      message: "User promoted to admin",
    });
  } catch (err) {
    console.error(err);
  }
  return Response.json({ message: "something went wrong" }, { status: 500 });
};
