"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { MoreHorizontal, Pencil, Trash2, Eye, Text } from "lucide-react";

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
import { parseAsString, useQueryState } from "nuqs";

//types >>>>>>>>>>>>>>

interface Invoice {
  id: string;
  invoiceNo: string;

  customer: {
    name: string;
  };

  invoiceDate: string;
  dueDate: string;

  total: number;

  status: "unpaid" | "paid";
}

// dummy data

const dummyInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNo: "INV-1001",
    customer: { name: "Rahul Sharma" },
    invoiceDate: "2026-06-01",
    dueDate: "2026-06-10",
    total: 12500,
    status: "paid",
  },
  {
    id: "2",
    invoiceNo: "INV-1002",
    customer: { name: "Priya Verma" },
    invoiceDate: "2026-06-03",
    dueDate: "2026-06-12",
    total: 8900,
    status: "unpaid",
  },
  {
    id: "3",
    invoiceNo: "INV-1003",
    customer: { name: "Amit Kumar" },
    invoiceDate: "2026-06-05",
    dueDate: "2026-06-15",
    total: 15200,
    status: "paid",
  },
  {
    id: "4",
    invoiceNo: "INV-1004",
    customer: { name: "Neha Singh" },
    invoiceDate: "2026-06-07",
    dueDate: "2026-06-20",
    total: 4300,
    status: "unpaid",
  },
];

// invoice tabel

const InvoiceTable = () => {
  const [name] = useQueryState("name", parseAsString.withDefault(""));

  // filter data
  const data = React.useMemo(() => {
    if (!name) return dummyInvoices;

    return dummyInvoices.filter((invoice) =>
      invoice.customer.name.toLowerCase().includes(name.toLowerCase()),
    );
  }, [name]);

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
        accessorKey: "invoiceNo",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Invoice #" />
        ),
      },

      // customer
      {
        id: "customer",
        accessorFn: (row) => row.customer.name,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Customer" />
        ),
        cell: ({ row }) => {
          const customer = row.original.customer;

          return (
            <div className="flex items-center gap-2">
              {/* Avatar removed → initials only */}
              <div className="h-8 w-8 rounded-full bg-[#F5F5F5] text-black flex items-center justify-center text-sm font-semibold">
                {customer.name.charAt(0).toUpperCase()}
              </div>

              <span>{customer.name}</span>
            </div>
          );
        },
        meta: {
          label: "name",
          placeholder: "Search customer name ...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
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

      // due date

      {
        accessorKey: "dueDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Due Date" />
        ),
        cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString(),
      },

      // status
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ row }) => {
          const status = row.original.status;

          const colors = {
            paid: "bg-green-100 text-green-700",
            unpaid: "bg-yellow-100 text-yellow-700",
          };

          return (
            <span
              className={`px-2 py-1 rounded-full text-xs capitalize ${colors[status]}`}
            >
              {status}
            </span>
          );
        },
      },

      // total
      {
        accessorKey: "total",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Amount" />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-green-600">
            ₹{row.original.total.toLocaleString("en-IN")}
          </span>
        ),
      },

      // actions
      {
        id: "actions",
        cell: ({ row }) => {
          const id = row.original.id;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/panel/invoices/${id}`}>
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
    data,
    columns,
    pageCount: Math.ceil(data.length / 10),

    initialState: {
      sorting: [{ id: "invoiceNo", desc: true }],
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
