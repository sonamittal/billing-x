import { db } from "@/lib/database/db-connect";
import { invoice, invoicePayment } from "@/drizzle/schema/index";
import { nanoid } from "nanoid";
import { eq, inArray, and } from "drizzle-orm";
import type { EditInvoicePaymentSchema } from "@/components/validation/validation";

export const putPaymentController = async (
  invoiceId: string,
  data: EditInvoicePaymentSchema,
) => {
  if (!invoiceId) {
    return Response.json(
      { success: false, message: `Invoice id is required` },
      { status: 400 },
    );
  }
  // check exsting invoice
  const existingInvoice = await db.query.invoice.findFirst({
    where: eq(invoice.id, invoiceId),
  });
  if (!existingInvoice) {
    return Response.json(
      { success: false, message: `Invoice not found` },
      { status: 404 },  
    );
  }

  // transaction
  await db.transaction(async (tx) => {
    // check existing  payment
    const existingPayments = await tx.query.invoicePayment.findMany({
      where: eq(invoicePayment.invoiceId, invoiceId),
    });

    // Update or Insert
    for (const payment of data.payments) {
      if (payment.paymentId) {
        await tx
          .update(invoicePayment)
          .set({
            paymentDate: payment.paymentDate,
            paymentMode: payment.paymentMode,
            amountReceived: payment.amountReceived.toString(),
          })
          .where(
            and(
              eq(invoicePayment.id, payment.paymentId),
              eq(invoicePayment.invoiceId, invoiceId),
            ),
          );
      } else {
        await tx.insert(invoicePayment).values({
          id: nanoid(),
          invoiceId,
          customerId: data.customerId,
          paymentDate: payment.paymentDate,
          paymentMode: payment.paymentMode,
          amountReceived: payment.amountReceived.toString(),
        });
      }
    }

    const existingPaymentIds = existingPayments.map((payment) => payment.id);
    // Existing payment ids from request
    const requestPaymentIds = data.payments
      .filter((payment) => payment.paymentId)
      .map((payment) => payment.paymentId);

    // Delete removed payments
    const deleteIds = existingPaymentIds.filter(
      (id) => !requestPaymentIds.includes(id),
    );

    if (deleteIds.length > 0) {
      await tx
        .delete(invoicePayment)
        .where(inArray(invoicePayment.id, deleteIds));
    }

    // fetch latest payment
    const latestPayments = await tx.query.invoicePayment.findMany({
      where: eq(invoicePayment.invoiceId, invoiceId),
    });
    // total paid
    const totalPaid = latestPayments.reduce(
      (sum, payment) => sum + Number(payment.amountReceived),
      0,
    );
    //Invoice Total
    const invoiceTotal = Number(existingInvoice.totalAmount);

    if (totalPaid > invoiceTotal) {
      throw new Error("Received amount cannot exceed invoice total amount");
    }
    // Payment Status
    let paymentStatus: "unpaid" | "partially_paid" | "paid";

    if (totalPaid === 0) {
      paymentStatus = "unpaid";
    } else if (totalPaid < invoiceTotal) {
      paymentStatus = "partially_paid";
    } else {
      paymentStatus = "paid";
    }

    await tx
      .update(invoice)
      .set({
        paymentStatus,
      })
      .where(eq(invoice.id, invoiceId));
  });
  return Response.json({
    success: true,
    message: "Payments updated successfully",
  });
};
