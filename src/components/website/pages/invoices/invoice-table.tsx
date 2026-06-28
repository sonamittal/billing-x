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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

//types >>>>>>>>>>>>>>

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: string;
  status: "draft" | "sent";
  paymentStatus: "paid" | "unpaid";
  customer: {
    name: string;
  };
}

// invoice tabel

const InvoiceTable = () => {
  const [name] = useQueryState("name", parseAsString.withDefault(""));

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

    if (!name) return data;

    return data.filter((invoice) =>
      invoice.customerName.toLowerCase().includes(name.toLowerCase()),
    );
  }, [data, name]);

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
        accessorFn: (row) => row.customer.name,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Customer" />
        ),
        cell: ({ row }) => {
          const customerName = row.original.customerName;

          return (
            <div className="flex items-center gap-2">
              {/* Avatar removed → initials only */}
              <div className="h-8 w-8 rounded-full bg-[#F5F5F5] text-black flex items-center justify-center text-sm font-semibold">
                {customerName.charAt(0).toUpperCase()}
              </div>

              <span>{customerName}</span>
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
            draft: "bg-gray-100 text-gray-700",
            sent: "bg-green-100 text-green-700",
          };

          return (
            <span
              className={`px-2 py-1 rounded-md text-xs capitalize ${colors[status]}`}
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
            ₹{Number(row.original.totalAmount).toLocaleString("en-IN")}
          </span>
        ),
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
