import { db } from "@/lib/database/db-connect";
import { user } from "@/drizzle/schema";
import { ilike, or } from "drizzle-orm";

export const getUsers = async (search: string) => {
  try {
    const data = await db
      .select()
      .from(user)
      .where(
        search
          ? or(
              ilike(user.name, `%${search}%`),
              ilike(user.email, `%${search}%`),
            )
          : undefined,
      );

    return {
      status: 200,
      json: {
        success: true,
        message: "Users fetched successfully",
        data,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      json: {
        success: false,
        message: error.message,
      },
    };
  }
};
