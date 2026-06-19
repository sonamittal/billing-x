"use client";
import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Text,
  Pencil,
  Trash2,
  Mail,
  Phone,
  ArrowUpRight,
  ArrowUpLeft,
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
import axios from "axios";
import DeleteCustomerDialog from "@/components/website/pages/customers/edit-customers/delete-dialog";
// types
interface Customer {
  id: string;
  userId: string;
  user: {
    name: string;
    image?: string;
  };
  mobile?: string;
  email: string;
  companyName?: string;
  receivable: number;
  unusedCredit: number;
}
interface SelectedUser {
  id: string;
  user: {
    name: string;
  } | null;
}

// customer table
const CustomersTable = () => {
  const [selectedRow, setSelectedRow] = React.useState<any | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<SelectedUser | null>(
    null,
  );
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const handleOpenDeleteDialog = (customer: Customer, row: any) => {
    row.toggleSelected(true);
    setSelectedUser({
      id: customer.id,
      user: {
        name: customer.user.name ?? "Unknown",
      },
    });
    setSelectedRow(row);
    setIsDeleteOpen(true);
  };
  const [name] = useQueryState("name", parseAsString.withDefault(""));

  // Fetch users
  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["customers", name],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/panel/customers", {
          params: { name },
        });
        return res.data;
      } catch (error) {
        const message = axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

        throw new Error(message || "Failed to fetch customers");
      }
    },
  });

  // filter data
  const filteredData = React.useMemo(() => {
    return customers.filter((customer) => {
      const matchName =
        name === "" ||
        customer.user.name.toLowerCase().includes(name.toLowerCase());
      return matchName;
    });
  }, [customers, name]);

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

      // User deatils
      {
        id: "name",
        accessorFn: (row) => row.user.name,
        header: ({ column }: { column: Column<Customer, unknown> }) => (
          <DataTableColumnHeader column={column} label="Customer" />
        ),

        cell: ({ row }) => {
          const user = row.original.user;
          return (
            <div className="flex items-center gap-2">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover border"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-[#F5F5F5] text-black flex items-center justify-center text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              <span>
                {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
              </span>
            </div>
          );
        },
        meta: {
          label: "name",
          placeholder: "Search name ...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },

      // linked user
      {
        id: "linkedUser",
        accessorKey: "linkedUser",
        header: ({ column }: { column: Column<Customer, unknown> }) => (
          <DataTableColumnHeader column={column} label="Linked User" />
        ),

        cell: ({ row }) => {
          const user = row.original.user;

          return (
            <Link
              href={`/panel/users/`}
              className="flex flex-col hover:underline"
            >
              <span>
                {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
              </span>

              <div className="flex items-center gap-1 font-semiBold text-sm text-muted-foreground">
                <ArrowUpRight className="h-3 w-3" />
                View Profile
              </div>
            </Link>
          );
        },
      },

      // contact details
      {
        id: "conatct details",
        accessorKey: "email",
        header: ({ column }: { column: Column<Customer, unknown> }) => (
          <DataTableColumnHeader column={column} label="Conatct Details" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-1" />
              {row.original.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-1" />
              <span className="text-sm">
                {row.original.mobile ?? "not provided"}
              </span>
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
        cell: ({ row }) => row.original.companyName || "ByteWyte",
      },

      // receivable
      {
        id: "receivable",
        accessorKey: "receivable",
        header: ({ column }: { column: Column<Customer, unknown> }) => (
          <DataTableColumnHeader column={column} label="Receivable" />
        ),
        cell: ({ row }) => (
          <span className="text-red-500  font-medium">
            ₹{row.original.receivable ?? 2000}
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
            ₹{row.original.unusedCredit ?? 400}
          </span>
        ),
      },
      // actions
      {
        id: "actions",
        cell: ({ row }) => {
          const customerId = row.original.id;
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
                    href={`/panel/customers/${customerId}`}
                    className="flex items-center text-white-800"
                  >
                    <Pencil className="mr-2 h-3 w-2  text-white-800" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleOpenDeleteDialog(row.original, row)}
                >
                  <Trash2 className="mr-2 h-4 w-4  text-red-400" />
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

  const { table } = useDataTable<Customer>({
    data: filteredData,
    columns,
    pageCount: 2,
    initialState: {
      sorting: [{ id: "name", desc: false } as any],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="data-table-container">
      {isLoading ? (
        <div>Loading users...</div>
      ) : (
        <>
          <DataTable table={table}>
            <DataTableToolbar table={table} />
          </DataTable>
          {selectedUser && (
            <DeleteCustomerDialog
              customer={selectedUser}
              open={isDeleteOpen}
              setOpen={(open) => {
                setIsDeleteOpen(open);
                if (!open && selectedRow) {
                  selectedRow.toggleSelected(false);
                  setSelectedRow(null);
                }
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
export default CustomersTable;
