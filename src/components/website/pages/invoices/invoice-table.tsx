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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDataTable } from "@/hooks/use-data-table";
import { parseAsString, useQueryState, parseAsArrayOf } from "nuqs";
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
  // fetch data
  const { data, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await axios.get("/api/panel/invoices");
      return response.data.data as Invoice[];
    },
  });

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
        id: "invoiceDate",
        accessorKey: "invoiceDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Invoice Date" />
        ),
        cell: ({ row }) =>
          new Date(row.original.invoiceDate).toLocaleDateString(),
      },
      //status
      {
        id: "status",
        accessorKey: "status",

        filterFn: (row, id, value) => {
          if (!Array.isArray(value) || value.length === 0) {
            return true;
          }

          return value.includes(row.getValue(id));
        },

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
        cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString(),
      },

      // payment Status

      {
        id: "paymentStatus",
        accessorKey: "paymentStatus",

        filterFn: (row, id, value) => {
          if (!Array.isArray(value) || value.length === 0) {
            return true;
          }

          return value.includes(row.getValue(id));
        },

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
                <Link href={`/panel/invoices/${invoiceId}`}>
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
  const { table } = useDataTable({
    data: data ?? [],
    columns,
    pageCount: Math.ceil((data?.length ?? 0) / 10),

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
