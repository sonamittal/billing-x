import { db } from "@/lib/database/db-connect";
import { customer } from "@/drizzle/schema/index";
import { eq } from "drizzle-orm";
export const putCustomerController = async (body: any) => {
  const {
    id,
    customerType,
    primaryContact,
    companyName,
    currency,
    language,
    email,
    workPhone,
    mobile,
  } = body;

  if (!id) {
    return {
      status: 400,
      json: {
        success: false,
        message: "Customer id is required",
      },
    };
  }
  // check customer exists
  const existingCustomer = await db.query.customer.findFirst({
    where: (c, { eq }) => eq(c.id, id),
  });
  if (!existingCustomer) {
    return {
      status: 404,
      json: {
        success: false,
        message: "Customer not found",
      },
    };
  }
  // update customer
  const res = await db
    .update(customer)
    .set({
      customerType,
      companyName,
      currency,
      language,
      // primary contact
      salutation: primaryContact.salutation,
      firstName: primaryContact.firstName,
      lastName: primaryContact.lastName,
      email,
      workPhone,
      mobile,
    })
    .where(eq(customer.id, id))
    .returning();

  return {
    status: 200,
    json: {
      success: true,
      message: "Customer updated successfully",
      data: res[0],
    },
  };
};
