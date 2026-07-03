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
} from "lucide-react";

import { INVOICE_STATUS, PAYMENT_STATUS } from "@/lib/constants";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDataTable } from "@/hooks/use-data-table";
import { parseAsString, useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Badge } from "@/components/ui/badge";

//types >>>>>>>>>>>>>>

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: string;
  status: "draft" | "sent";
  paymentStatus: "paid" | "partially_paid" | "unpaid";
  balance: number;
  customer: {
    id: string;
    user: {
      name: string;
      image: string | null;
    };
  };
}

// invoice tabel

const InvoiceTable = () => {
  const [name] = useQueryState("name", parseAsString.withDefault(""));
  const [status] = useQueryState("status", parseAsString.withDefault(""));
  const [paymentStatus] = useQueryState(
    "paymentStatus",
    parseAsString.withDefault(""),
  );

  // fetch data
  const { data, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await axios.get("/api/panel/invoices");
      return response.data.data as Invoice[];
    },
  });

  const filteredData = React.useMemo(() => {
    if (!data) return [];

    return data.filter((invoice) => {
      const matchName =
        !name ||
        invoice.customerName.toLowerCase().includes(name.toLowerCase());

      const matchStatus = !status || invoice.status === status;

      const matchPaymentStatus =
        !paymentStatus || invoice.paymentStatus === paymentStatus;

      return matchName && matchStatus && matchPaymentStatus;
    });
  }, [data, name, status, paymentStatus]);

  // columns

  const columns = React.useMemo<ColumnDef<Invoice>[]>(
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
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 32,
      },

      // invoice no
      {
        accessorKey: "invoiceNumber",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Invoice #" />
        ),
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
                  <img
                    src={user.image}
                    alt={user.name}
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
        accessorKey: "invoiceDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Invoice Date" />
        ),
        cell: ({ row }) =>
          new Date(row.original.invoiceDate).toLocaleDateString(),
      },

      {
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
          options: INVOICE_STATUS.map((status) => ({
            ...status,
          })),
        },

        enableColumnFilter: true,
      },
      // due date
      {
        accessorKey: "dueDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Due Date" />
        ),
        cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString(),
      },

      // payment Status
      {
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/panel/invoices/${invoiceId}`}>
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
          );
        },
        size: 32,
      },
    ],
    [],
  );

  // table
  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil(filteredData.length / 10),

    initialState: {
      sorting: [{ id: "invoiceNumber", desc: true }],
      columnPinning: { right: ["actions"] },
    },

    getRowId: (row) => row.id,
  });

  return (
    <div className="data-table-container">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
};

export default InvoiceTable;
