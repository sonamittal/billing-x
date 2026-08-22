"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Text,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Send,
  FileClock,
  Eye,
} from "lucide-react";

import { INVOICE_STATUS, PAYMENT_STATUS } from "@/lib/constants";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from "nuqs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDataTable } from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Badge } from "@/components/ui/badge";

import type { InvoicesRow } from "@/app/api/panel/invoices/getController";
import { InvoicesResponse } from "@/app/api/panel/invoices/getController";
import Image from "next/image";

// invoice tabel

const InvoiceTable = () => {
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [paymentStatus] = useQueryState(
    "paymentStatus",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [invoiceNumber] = useQueryState(
    "invoiceNumber",
    parseAsString.withDefault(""),
  );

  const [page] = useQueryState("page", parseAsInteger.withDefault(1));

  const [perPage] = useQueryState("pageSize", parseAsInteger.withDefault(10));

  const [sortBy] = useQueryState(
    "sortBy",
    parseAsString.withDefault("createdAt"),
  );

  const [sortOrder] = useQueryState(
    "sortOrder",
    parseAsString.withDefault("desc"),
  );

  // fetch data
  const { data, isPending } = useQuery<InvoicesResponse>({
    queryKey: [
      "invoices",
      status,
      paymentStatus,
      invoiceNumber,
      page,
      perPage,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      const response = await axios.get<InvoicesResponse>(
        "/api/panel/invoices",
        {
          params: {
            status: status.join(","),
            paymentStatus: paymentStatus.join(","),
            invoiceNumber: invoiceNumber,
            page,
            perPage,
            sortBy,
            sortOrder,
          },
        },
      );
      return response.data;
    },
  });

  // columns

  const columns = React.useMemo<ColumnDef<InvoicesRow>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),

        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 32,
      },

      // invoice no
      {
        id: "invoiceNumber",
        accessorKey: "invoiceNumber",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Invoice #" />
        ),
        meta: {
          label: "invoiceNumber",
          placeholder: "Search invoiceNumber...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },

      // customer
      {
        id: "customer",
        accessorFn: (row) => row.customer?.user?.name,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Customer" />
        ),
        cell: ({ row }) => {
          const user = row.original.customer?.user;

          return (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>

              <span>
                {user?.name
                  ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                  : "Unknown"}
              </span>
            </div>
          );
        },
      },
      // invoice date
      {
        id: "invoiceDate",
        accessorKey: "invoiceDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Invoice Date" />
        ),
        cell: ({ row }) => row.original.invoiceDate,
      },
      //status
      {
        id: "status",
        accessorKey: "status",

        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),

        cell: ({ row }) => {
          const status = INVOICE_STATUS.find(
            (item) => item.value === row.original.status,
          );

          if (!status) return null;

          return (
            <Badge
              variant="outline"
              className={`flex w-fit items-center gap-1 ${status.color}`}
            >
              {status.value === "sent" ? (
                <Send className="h-4 w-4" />
              ) : (
                <FileClock className="h-4 w-4" />
              )}

              {status.label}
            </Badge>
          );
        },

        meta: {
          label: "Invoice Status",
          variant: "multiSelect",
          options: INVOICE_STATUS.map((status) => ({ ...status })),
        },

        enableColumnFilter: true,
      },
      // due date
      {
        accessorKey: "dueDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Due Date" />
        ),
        cell: ({ row }) => row.original.dueDate,
      },

      // payment Status

      {
        id: "paymentStatus",
        accessorKey: "paymentStatus",

        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Payment Status" />
        ),

        cell: ({ row }) => {
          const status = PAYMENT_STATUS.find(
            (item) => item.value === row.original.paymentStatus,
          );

          if (!status) return null;

          return (
            <Badge
              variant="outline"
              className={`flex w-fit items-center gap-1 ${status.color}`}
            >
              {status.value === "paid" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : status.value === "partially_paid" ? (
                <Clock3 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}

              {status.label}
            </Badge>
          );
        },

        meta: {
          label: "Payment Status",
          variant: "multiSelect",
          options: PAYMENT_STATUS.map((status) => ({ ...status })),
        },

        enableColumnFilter: true,
      },

      // total
      {
        id: "totalAmount",
        accessorKey: "totalAmount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Amount" />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-green-600">
            ₹{Number(row.original.totalAmount).toLocaleString("en-IN")}
          </span>
        ),
      },

      // Balance Due
      {
        id: "balance",
        accessorKey: "balance",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Balance Due" />
        ),
        cell: ({ row }) => {
          const balance = Number(row.original.balance ?? 0);

          return (
            <span
              className={`font-semibold ${
                balance === 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{balance.toLocaleString("en-IN")}
            </span>
          );
        },
      },

      // actions
      {
        id: "actions",
        cell: ({ row }) => {
          const invoiceId = row.original.id;

          return (
            <div className="flex items-center gap-2">
              {/* View */}
              <Button variant="outline" size="icon" asChild>
                <Link href={`/panel/invoices/${invoiceId}?tab=overview`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/panel/invoices/${invoiceId}?tab=invoice-details`}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        size: 32,
      },
    ],
    [],
  );

  // table
  const { table } = useDataTable<InvoicesRow>({
    data: data?.data ?? [],
    columns,
    pageCount: data?.pagination?.totalPages ?? 0,
    initialState: {
      sorting: [{ id: "invoiceNumber", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="data-table-container">
      <DataTable table={table} isLoading={isPending}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
};

export default InvoiceTable;
