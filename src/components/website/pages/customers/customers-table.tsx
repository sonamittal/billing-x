"use client";
import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Text,
  Pencil,
  Trash2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import * as React from "react";
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
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Customer {
  id: string;
  username: string;
  companyName?: string;
  email: string;
  image?: string;
  phone: string;
  receivable: number;
  usedCredit: number;
}

const CustomersTable = () => {
  const [username] = useQueryState("username", parseAsString.withDefault(""));

  // Fetch users
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      return [
        {
          id: "1",
          username: "sona Mittal",
          phone: "9876543210",
          email: "sonamitaal285@gmail.com",
          companyName: "byte",
          receivable: 1200,
          usedCredit: 500,
        },
        {
          id: "2",
          username: "rahul Sharma",
          phone: "9999999999",
          email: "rahul56@gmail.com",
          companyName: "ABC Pvt Ltd",
          receivable: 5000,
          usedCredit: 2000,
        },
      ];
    },
  });
  const filteredData = React.useMemo(() => {
    return customers.filter((customer) => {
      const matchUsername =
        username === "" ||
        customer.username.toLowerCase().includes(username.toLowerCase());
      return matchUsername;
    });
  }, [customers, username]);
  const columns = React.useMemo<ColumnDef<Customer>[]>(
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
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      // username
      {
        id: "username",
        accessorKey: "username",
        header: ({ column }: { column: Column<Customer, unknown> }) => (
          <DataTableColumnHeader column={column} label="username" />
        ),

        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-2">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.username}
                  className="h-8 w-8 rounded-full object-cover border"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-[#F5F5F5] text-black flex items-center justify-center text-sm font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}

              <span>{user.username}</span>
            </div>
          );
        },
        meta: {
          label: "username",
          placeholder: "Search username...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      // contact details
      {
        id: "conatct details",
        accessorKey: "email",
        header: ({ column }: { column: Column<Customer, unknown> }) => (
          <DataTableColumnHeader column={column} label="Conatct details" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-1" />
              {row.original.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-1" />
              {row.original.phone}
            </div>
          </div>
        ),
      },
      // company name
      {
        id: "companyName",
        accessorKey: "companyName",
        header: ({ column }: { column: Column<Customer, unknown> }) => (
          <DataTableColumnHeader column={column} label="Company Name" />
        ),
        cell: ({ row }) => row.original.companyName || "—",
      },
            {
        id: "companyName",
        accessorKey: "companyName",
        header: ({ column }: { column: Column<Customer, unknown> }) => (
          <DataTableColumnHeader column={column} label="Company Name" />
        ),
        cell: ({ row }) => row.original.companyName || "—",
      },
      // receivable
      {
        id: "receivable",
        accessorKey: "receivable",
        size: 32,
        header: ({ column }: { column: Column<Customer, unknown> }) => (
          <DataTableColumnHeader column={column} label="Receivable" />
        ),
        cell: ({ row }) => (
          <span className="text-red-500 font-medium">
            ₹{row.original.receivable}
          </span>
        ),
      },
      // unusedCredit
      {
        id: "unusedCredit",
        accessorKey: "unusedCredit",
        size: 32,
        header: ({ column }: { column: Column<Customer, unknown> }) => (
          <DataTableColumnHeader column={column} label="UnUsed Credit" />
        ),
        cell: ({ row }) => (
          <span className="text-yellow-600 font-medium">
            ₹{row.original.usedCredit}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const userId = row.original.id;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link
                    href={`/panel/users/${userId}`}
                    className="flex items-center text-white-800"
                  >
                    <Pencil className="mr-2 h-3 w-2  text-white-800" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <Link
                    href={`/panel/users/${userId}`}
                    className="flex items-center"
                  >
                    <Trash2 className="mr-2 h-4 w-4  text-red-400" />
                    Delete
                  </Link>
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

  const { table } = useDataTable<Customer>({
    data: filteredData,
    columns,
    pageCount: 2,
    initialState: {
      sorting: [{ id: "username", desc: false }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="data-table-container">
      {isLoading ? (
        <div>Loading users...</div>
      ) : (
        <DataTable table={table}>
          <DataTableToolbar table={table} />
        </DataTable>
      )}
    </div>
  );
};
export default CustomersTable;
