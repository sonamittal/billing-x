import { db } from "@/lib/database/db-connect";
import { user, customer } from "@/drizzle/schema/index";
import { nanoid } from "nanoid";
interface PostUserBody {
  image: string;
  name: string;
  email: string;
}
// user
export const postUser = async (body: PostUserBody) => {
  const { image, name, email } = body;

  if (!image || !name || !email) {
    return {
      status: 400,
      json: { success: false, message: `All fields are required` },
    };
  }

  const existingUser = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (existingUser) {
    return {
      status: 409,
      json: { success: false, message: `User already exists` },
    };
  }

  const result = await db
    .insert(user)
    .values({
      id: nanoid(),
      name,
      email,
      image,
    })
    .returning();

  return {
    status: 200,
    json: {
      success: true,
      message: `User created successfully`,
      data: result[0],
    },
  };
};

// type customer
type CustomerType = "individual" | "business";
interface PostCustomerBody {
  userId: string;
  customerType: CustomerType;
  companyName?: string;
  currency: string;
  language: string;
  countryId: string;
  country: string;
  stateId: string;
  state: string;
  cityId: string;
  city: string;
  pinCode: string;
  address: {
    street1: string;
    street2?: string;
  };
}
// customer
export const postCustomer = async (body: PostCustomerBody) => {
  const {
    userId,
    customerType,
    companyName,
    currency,
    language,
    countryId,
    country,
    stateId,
    state,
    cityId,
    city,
    pinCode,
    address,
  } = body;

  if (!userId) {
    return {
      status: 400,
      json: { success: false, message: `userId is required` },
    };
  }

  const existingUser = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });

  if (!existingUser) {
    return {
      status: 404,
      json: { success: false, message: `User not found` },
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
        message: `Customer already exists for this user`,
      },
    };
  }

  const result = await db
    .insert(customer)
    .values({
      id: nanoid(),
      userId,
      customerType,
      companyName,
      currency,
      language,
      countryId,
      country,
      stateId,
      state,
      cityId,
      city,
      pinCode,
      street1: address.street1,
      street2: address.street2 ?? null,
    })
    .returning();

  return {
    status: 200,
    json: {
      success: true,
      message: `Customer created successfully`,
      data: result[0],
    },
  };
};
