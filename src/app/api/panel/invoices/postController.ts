import { db } from "@/lib/database/db-connect";
import { customer, invoice, invoiceItem } from "@/drizzle/schema/index";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import type { AddInvoiceSchema } from "@/components/validation/validation";
import type { NewInvoice, NewInvoiceItem } from "@/app/api/panel/invoices/type";

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
      { success: false, message: `Custome not found` },
      { status: 404 },
    );
  }

  // invoice id
  const invoiceId = nanoid();

  // Transaction
  await db.transaction(async (tx) => {
// invoice data
    const invoiceData: NewInvoice = {
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

      customerNotes: data.customerNotes,
      termsAndConditions: data.termsAndConditions,

      status: data.status,
      paymentStatus: "unpaid",
      paymentDate: null,
    };
    // invoice item
    await tx.insert(invoice).values(invoiceData);
    const items: NewInvoiceItem[] = data.items.map((item) => ({
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
  });
  return Response.json(
    {
      success: true,
      message: `Invoice created successfully`,
    },
    { status: 200 },
  );
};
