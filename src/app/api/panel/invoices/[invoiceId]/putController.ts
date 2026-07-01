import { db } from "@/lib/database/db-connect";
import { customer, invoice, invoiceItem } from "@/drizzle/schema/index";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import type { EditInvoiceSchema } from "@/components/validation/validation";
import type {
  EditInvoice,
  EditInvoiceItem,
} from "@/app/api/panel/invoices/type";

export const putInvoiceController = async (
  invoiceId: string,
  data: EditInvoiceSchema,
) => {
  // check invoice id
  if (!invoiceId) {
    return Response.json(
      { success: false, message: `Invoice id is required` },
      { status: 400 },
    );
  }

  // check  invoice exist
  const exstingInvoice = await db.query.invoice.findFirst({
    where: eq(invoice.id, invoiceId),
  });

  if (!exstingInvoice) {
    return Response.json(
      { success: false, message: `Invoice not found` },
      { status: 404 },
    );
  }

  // check duplicate invoice nmber
  const duplicateInvoice = await db.query.invoice.findFirst({
    where: eq(invoice.invoiceNumber, data.invoiceNumber),
  });

  if (duplicateInvoice && duplicateInvoice.id !== invoiceId) {
    return Response.json(
      {
        success: false,
        message: "Invoice number already exists.",
      },
      { status: 409 },
    );
  }

  //check cstomer exist
  const existingCustomer = await db.query.customer.findFirst({
    where: eq(customer.id, data.customerId),
    with: {
      user: true,
    },
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

  // transaction
  await db.transaction(async (tx) => {
    const editInvoiceData: EditInvoice = {
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
    };
    await tx
      .update(invoice)
      .set(editInvoiceData)
      .where(eq(invoice.id, invoiceId));

    // delete old invoice item
    await tx.delete(invoiceItem).where(eq(invoiceItem.invoiceId, invoiceId));

    // Create new invoice items
    const items: EditInvoiceItem[] = data.items.map((item) => ({
      id: nanoid(),
      invoiceId,
      itemName: item.itemName,
      description: item.description,
      unit: item.unit,

      quantity: item.quantity.toString(),
      rate: item.rate.toString(),
      amount: item.amount.toString(),
    }));
    // insert  new items
    await tx.insert(invoiceItem).values(items);
  });

  return Response.json(
    {
      success: true,
      message: "Invoice updated successfully",
    },
    { status: 200 },
  );
};


