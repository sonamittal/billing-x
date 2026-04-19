import { db } from "@/lib/database/db-connect";
import { user, customer } from "@/drizzle/schema/index";
import { nanoid } from "nanoid";

// user
export const postUser = async (body: any) => {
  const { image, username, email } = body;

  if (!image || !username || !email) {
    return {
      status: 400,
      json: { success: false, message: "All fields are required" },
    };
  }

  const existingUser = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (existingUser) {
    return {
      status: 409,
      json: { success: false, message: "User already exists" },
    };
  }

  const result = await db
    .insert(user)
    .values({
      id: nanoid(),
      name: username,
      email,
      image,
    })
    .returning();

  return {
    status: 201,
    json: {
      success: true,
      message: "User created successfully",
      data: result[0],
    },
  };
};

// customer
export const postCustomer = async (body: any) => {
  const {
    userId,
    partnerType,
    displayName,
    companyName,
    currency,
    language,
    country,
    state,
    city,
    pinCode,
    address,
  } = body;

  if (!userId) {
    return {
      status: 400,
      json: { success: false, message: "userId is required" },
    };
  }

  const existingUser = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });

  if (!existingUser) {
    return {
      status: 404,
      json: { success: false, message: "User not found" },
    };
  }

  const existingCustomer = await db.query.customer.findFirst({
    where: (c, { eq }) => eq(c.userId, userId),
  });

  if (existingCustomer) {
    return {
      status: 409,
      json: {
        success: false,
        message: "Customer already exists for this user",
      },
    };
  }

  const result = await db
    .insert(customer)
    .values({
      id: nanoid(),
      userId,
      partnerType,
      displayName,
      companyName,
      currency,
      language,
      country,
      state,
      city,
      pinCode,
      address,
    })
    .returning();

  return {
    status: 201,
    json: {
      success: true,
      message: "Customer created successfully",
      data: result[0],
    },
  };
};
