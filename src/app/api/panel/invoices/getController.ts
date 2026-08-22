import { db } from "@/lib/database/db-connect";
import { and, asc, desc, ilike, inArray, count } from "drizzle-orm";
import { invoice } from "@/drizzle/schema/index";
import { z } from "zod";
import {
  INVOICE_STATUS,
  INVOICE_PAYMENTSTATUS,
  type InvoiceStatus,
  type InvoicePaymentStatus,
} from "@/drizzle/schema/type";

export const invoicesQuerySchema = z.object({
  status: z
    .string()
    .transform((value) => value.split(","))
    .pipe(z.array(z.enum(INVOICE_STATUS)))
    .optional(),
  paymentStatus: z
    .string()
    .transform((value) => value.split(","))
    .pipe(z.array(z.enum(INVOICE_PAYMENTSTATUS)))
    .optional(),
  invoiceNumber: z.string().optional(),
  page: z.coerce.number().optional(),
  perPage: z.coerce.number().optional(),
  sortBy: z
    .enum([
      "invoiceNumber",
      "invoiceDate",
      "dueDate",
      "totalAmount",
      "createdAt",
    ])
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

type InvoicesQuery = z.infer<typeof invoicesQuerySchema>;

export interface InvoicesRow {
  id: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: string;
  status: InvoiceStatus;
  paymentStatus: InvoicePaymentStatus;
  balance: Number;
  customer: {
    id: string;
    user: {
      name: string;
      image: string | null;
    };
  };
}

export interface InvoicesResponse {
  success: true;
  data: InvoicesRow[];
  pagination: {
    page: number;
    perPage: number;
    totalCount: number;
    totalPages: number;
  };
}

export const getAllInvoices = async ({
  status,
  paymentStatus,
  invoiceNumber,
  page = 1,
  perPage = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
}: InvoicesQuery): Promise<Response> => {
  console.log({
    status,
    paymentStatus,
  });
  const whereCondition = and(
    // Multiple invoice status
    status && status.length > 0 ? inArray(invoice.status, status) : undefined,

    // Multiple payment status
    paymentStatus && paymentStatus.length > 0
      ? inArray(invoice.paymentStatus, paymentStatus as InvoicePaymentStatus[])
      : undefined,

    // search invoice no
    invoiceNumber
      ? ilike(invoice.invoiceNumber, `%${invoiceNumber}%`)
      : undefined,
  );
  //pagination
  const offset = (page - 1) * perPage;

  // sorting
  const sortColumns = {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    totalAmount: invoice.totalAmount,
    createdAt: invoice.createdAt,
  };

  const sortColumn =
    sortColumns[sortBy as keyof typeof sortColumns] ?? invoice.createdAt;

  const orderBy = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

  // get total count
  const [{ totalCount }] = await db
    .select({
      totalCount: count(),
    })
    .from(invoice)
    .where(whereCondition);

  // database
  const invoicesListData = await db.query.invoice.findMany({
    where: whereCondition,

    with: {
      customer: {
        with: {
          user: true,
        },
      },

      items: true,

      payments: true,
    },

    orderBy,
    limit: perPage,
    offset,
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

  // total pages
  const totalPages = Math.ceil(Number(totalCount) / perPage);

  const response: InvoicesResponse = {
    success: true,
    data: data.map((row) => ({
      ...row,
      invoiceDate: row.invoiceDate.toISOString(),
      dueDate: row.dueDate.toISOString(),
    })),
    pagination: {
      page,
      perPage,
      totalCount: Number(totalCount),
      totalPages,
    },
  };

  return Response.json(response, {
    status: 200,
  });
};
