import { db } from "@/lib/database/db-connect";
import { customer, customerOtherDetails } from "@/drizzle/schema/index";
import { eq } from "drizzle-orm";
export const putCustomerController = async (body: any) => {
  try {
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
      return Response.json(
        { success: false, message: "Customer id is required" },
        { status: 400 },
      );
    }
    // check customer exists
    const existingCustomer = await db.query.customer.findFirst({
      where: (c, { eq }) => eq(c.id, id),
    });
    if (!existingCustomer) {
      return Response.json(
        { success: false, message: "Customer not found" },
        { status: 404 },
      );
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
    return Response.json(
      { success: true, message: "Customer updated successfully", data: res[0] },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      { success: false, message: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
};

// other deatils >>>>>>>>>>>>>>>>>>>>
export const putCustomerOtherDetailsController = async (body: any) => {
  try {
    const {
      id,
      pan,
      paymentTermId,
      documents,
      websiteURL,
      department,
      designation,
      x,
      facebook,
    } = body;

    if (!id) {
      return Response.json(
        { success: false, message: "Customer id is required" },
        { status: 400 },
      );
    }

    const existingCustomerOD = await db.query.customerOtherDetails.findFirst({
      where: (c, { eq }) => eq(c.customerId, id),
    });

    if (!existingCustomerOD) {
      await db
        .insert(customerOtherDetails)
        .values({ id: crypto.randomUUID(), customerId: id });
    }
    // db query
    const result = await db
      .update(customerOtherDetails)
      .set({
        pan,
        paymentTermId,
        documents: documents || [],
        websiteUrl: websiteURL,
        department,
        designation,
        x,
        facebook,
      })
      .where(eq(customerOtherDetails.customerId, id))
      .returning();
    return Response.json(
      {
        success: true,
        message: "Customer other details updated successfully",
        data: result[0],
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      { success: false, message: error?.message || "Internal Server Error" },
      { status: 500 },
    );
  }
};
