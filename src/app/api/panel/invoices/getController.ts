import { db } from "@/lib/database/db-connect";
export const getAllInvoices = async () => {
  const invoicesListData = await db.query.invoice.findMany({
    with: {
      customer: {
        with: {
          user: true,
        },
      },
      items: true,
      payments: true,
    },
    orderBy: (invoice, { desc }) => [desc(invoice.createdAt)],
  });

  const data = invoicesListData.map((invoice) => {
    const totalReceived = invoice.payments.reduce(
      (sum, payment) => sum + Number(payment.amountReceived),
      0,
    );
    const totalAmount = Number(invoice.totalAmount);

    return {
      ...invoice,
      totalReceived,
      balance: totalAmount - totalReceived,
    };
  });

  return Response.json(
    {
      success: true,
      data,
    },
    {
      status: 200,
    },
  );
};
