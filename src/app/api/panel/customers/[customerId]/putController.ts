import { db } from "@/lib/database/db-connect";
import { customer, customerOtherDetails } from "@/drizzle/schema/index";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// customer >>>>>>>>>>>>>>>>>>>>
interface PutCustomerBody {
  id: string;
  customerType: string;
  companyName: string;
  currency: string;
  language: string;
  email: string;
  workPhone: string;
  mobile: string;
}

export const putCustomerController = async (body: PutCustomerBody) => {
  const {
    id,
    customerType,
    // primaryContact,
    companyName,
    currency,
    language,
    email,
    workPhone,
    mobile,
  } = body;

  if (!id) {
    return Response.json(
      { success: false, message: `Customer id is required` },
      { status: 400 },
    );
  }
  // check customer exists
  const existingCustomer = await db.query.customer.findFirst({
    where: (c, { eq }) => eq(c.id, id),
  });
  if (!existingCustomer) {
    return Response.json(
      { success: false, message: `Customer not found` },
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
      // // primary contact
      // salutation: primaryContact.salutation,
      // firstName: primaryContact.firstName,
      // lastName: primaryContact.lastName,
      email,
      workPhone,
      mobile,
    })
    .where(eq(customer.id, id))
    .returning();
  return Response.json(
    { success: true, message: `Customer updated successfully`, data: res[0] },
    { status: 200 },
  );
};

// other deatils >>>>>>>>>>>>>>>>>>>>

interface DocumentFile {
  url: string;
  key: string;
  name?: string;
}
interface PutCustomerOtherDetailsBody {
  id: string;
  pan: string;
  paymentTermId: string | null;
  documents: DocumentFile[];
  websiteUrl: string;
  department: string;
  designation: string;
  x: string;
  facebook: string;
}

export const putCustomerOtherDetailsController = async (
  body: PutCustomerOtherDetailsBody,
) => {
  const {
    id,
    pan,
    paymentTermId,
    documents,
    websiteUrl,
    department,
    designation,
    x,
    facebook,
  } = body;

  if (!id) {
    return Response.json(
      { success: false, message: `Customer id is required` },
      { status: 400 },
    );
  }
  // check customer exist
  const existingCustomer = await db.query.customer.findFirst({
    where: (c, { eq }) => eq(c.id, id),
  });

  if (!existingCustomer) {
    return Response.json(
      { success: false, message: "Customer not found" },
      { status: 404 },
    );
  }
  // check customerOD exists
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
      documents: documents,
      websiteUrl,
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
      message: `Customer other details updated successfully`,
      data: result[0],
    },
    { status: 200 },
  );
};

// billing address >>>>>>>>>>>>>>>>>>>>

interface Address {
  street1?: string;
  street2?: string;
}
interface PutCBABody {
  id: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  mobile: string;
  address?: Address;
}

export const putCBAController = async (body: PutCBABody) => {
  const { id, country, state, city, pinCode, mobile, address } = body;

  if (!id) {
    return Response.json(
      { success: false, message: `Customer id is required` },
      { status: 400 },
    );
  }

  const existingCustomer = await db.query.customer.findFirst({
    where: (c, { eq }) => eq(c.id, id),
  });

  if (!existingCustomer) {
    return Response.json(
      { success: false, message: `Customer not found` },
      { status: 404 },
    );
  }

  const result = await db
    .update(customer)
    .set({
      country,
      state,
      city,
      pinCode,
      mobile,
      street1: address?.street1 ?? "",
      street2: address?.street2 ?? "",
    })
    .where(eq(customer.id, id))
    .returning();

  return Response.json(
    {
      success: true,
      message: `Billing address updated successfully`,
      data: result[0],
    },
    { status: 200 },
  );
};

// remarks >>>>>>>>>>>>>>>>>>>>

interface PutRemarksBody {
  id: string;
  remarks: string;
}

export const putCRController = async (body: PutRemarksBody) => {
  const { id, remarks } = body;

  if (!id) {
    return Response.json(
      {
        success: false,
        message: "Customer id is required",
      },
      { status: 400 },
    );
  }

  // check customer exists
  const existingCustomer = await db.query.customer.findFirst({
    where: (c, { eq }) => eq(c.id, id),
  });

  if (!existingCustomer) {
    return Response.json(
      {
        success: false,
        message: "Customer not found",
      },
      { status: 404 },
    );
  }

  // check remarks record exists
  const existingCR = await db.query.customerOtherDetails.findFirst({
    where: (c, { eq }) => eq(c.customerId, id),
  });

  // create if not exists
  if (!existingCR) {
    const res = await db
      .insert(customerOtherDetails)
      .values({
        id: nanoid(),
        customerId: id,
        remarks,
      })
      .returning();

    return Response.json(
      {
        success: true,
        message: "Remarks added successfully",
        data: res[0],
      },
      { status: 201 },
    );
  }

  // db query
  const result = await db
    .update(customerOtherDetails)
    .set({
      remarks,
    })
    .where(eq(customerOtherDetails.customerId, id))
    .returning();

  return Response.json(
    {
      success: true,
      message: "Remarks updated successfully",
      data: result[0],
    },
    { status: 200 },
  );
};
