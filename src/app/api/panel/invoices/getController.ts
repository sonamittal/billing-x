import { db } from "@/lib/database/db-connect";
export const getAllInvoices = async () => {
  const invoicesListData = await db.query.invoice.findMany({
    with: {
      customer: true,
      items: true,
    },
    orderBy: (invoice, { desc }) => [desc(invoice.createdAt)],
  });
  return Response.json(
    {
      success: true,
      data: invoicesListData,
    },
    {
      status: 200,
    },
  );
};
