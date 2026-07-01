import { db } from "@/lib/database/db-connect";
import {
  customer,
  invoice,
  invoiceItem,
  invoicePayment,
} from "@/drizzle/schema/index";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import type { AddInvoiceSchema } from "@/components/validation/validation";
import type { AddInvoice, AddInvoiceItem } from "@/app/api/panel/invoices/type";

export const postInvoice = async (data: AddInvoiceSchema) => {
  // check cstomer
  const existingCustomer = await db.query.customer.findFirst({
    where: eq(customer.id, data.customerId),
    with: {
      user: true,
    },
  });
  if (!existingCustomer) {
    return Response.json(
      { success: false, message: `Customer not found` },
      { status: 404 },
    );
  }

  // check duplicate  invoice number
  const existingInvoice = await db.query.invoice.findFirst({
    where: eq(invoice.invoiceNumber, data.invoiceNumber),
  });

  if (existingInvoice) {
    return Response.json(
      {
        success: false,
        message: `Invoice number already exists.`,
      },
      { status: 409 },
    );
  }
  // invoice id
  const invoiceId = nanoid();

  // calculate payment status
const totalReceived = (data.payments ?? []).reduce(
  (sum, payment) => sum + payment.amountReceived,
  0,
);

  let paymentStatus: "unpaid" | "partially_paid" | "paid" = "unpaid";

  if (totalReceived === 0) {
    paymentStatus = "unpaid";
  } else if (totalReceived >= data.totalAmount) {
    paymentStatus = "paid";
  } else {
    paymentStatus = "partially_paid";
  }
  // Transaction
  await db.transaction(async (tx) => {
    // invoice data
    const invoiceData: AddInvoice = {
      id: invoiceId,

      customerId: existingCustomer.id,
      customerName: existingCustomer.user?.name ?? "",

      invoiceNumber: data.invoiceNumber,

      invoiceDate: data.invoiceDate,
      dueDate: data.dueDate,

      subject: data.subject,

      subtotal: data.subtotal.toString(),
      discount: data.discount.toString(),
      totalAmount: data.totalAmount.toString(),

      paymentStatus,

      customerNotes: data.customerNotes,
      termsAndConditions: data.termsAndConditions,
      status: data.status,
    };
    // invoice item
    await tx.insert(invoice).values(invoiceData);
    const items: AddInvoiceItem[] = data.items.map((item) => ({
      id: nanoid(),
      invoiceId,
      itemName: item.itemName,

      description: item.description,

      unit: item.unit,

      quantity: item.quantity.toString(),

      rate: item.rate.toString(),

      amount: item.amount.toString(),
    }));
    // insert item
    await tx.insert(invoiceItem).values(items);

    //payments insert
    if (data.payments?.length) {
      await tx.insert(invoicePayment).values(
        data.payments.map((p) => ({
          id: nanoid(),
          invoiceId,
          customerId: existingCustomer.id,

          amountReceived: p.amountReceived.toString(),
          paymentMode: p.paymentMode,
          paymentDate: new Date(),
        })),
      );
    }
  });
  return Response.json(
    {
      success: true,
      message: `Invoice created successfully`,
    },
    { status: 200 },
  );
};
