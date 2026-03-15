"use client";
import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  MoreHorizontal,
  Text,
  Pencil,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import { USER_ROLES, USER_STATUS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  email: string;
  banned: boolean;
  emailVerified: boolean;
  role: "admin" | "staff" | "staffAssigned" | "timesheetStaff";
}

const UsersTable = () => {
  const [username] = useQueryState("username", parseAsString.withDefault(""));
  const [banned] = useQueryState(
    "banned",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [role] = useQueryState(
    "role",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await authClient.admin.listUsers({
        query: { limit: 100 },
      });

      if (error) throw new Error(error.message);

      return (data?.users || []).map((u: any) => ({
        id: u.id,
        username: u.username || u.name || "Unknown",
        email: u.email,
        banned: u.banned,
        emailVerified: u.emailVerified,
        role: Array.isArray(u.role)
          ? (u.role[0] as User["role"])
          : (u.role as User["role"]),
      }));
    },
  });

  const filteredData = React.useMemo(() => {
    return users.filter((user) => {
      const matchUsername =
        username === "" ||
        user.username.toLowerCase().includes(username.toLowerCase());
      const matchesStatus =
        banned.length === 0 || banned.includes(user.banned ? "true" : "false");
      const matchesRole = role.length === 0 || role.includes(user.role);
      return matchUsername && matchesStatus && matchesRole;
    });
  }, [users, username, banned, role]);

  const columns = React.useMemo<ColumnDef<User>[]>(
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
      {
        id: "username",
        accessorKey: "username",
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} label="Username" />
        ),
        cell: ({ cell }) => <div>{cell.getValue<User["username"]>()}</div>,
        meta: {
          label: "Username",
          placeholder: "Search username...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "email",
        accessorKey: "email",
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} label="Email" />
        ),
        enableColumnFilter: false,
      },
      {
        id: "role",
        accessorKey: "role",
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} label="Role" />
        ),
        meta: {
          label: "Role",
          variant: "multiSelect",
          options: USER_ROLES.map((role) => ({ ...role })),
        },
        enableColumnFilter: true,
      },
      {
        id: "banned",
        accessorKey: "banned",
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),

        cell: ({ row }) => {
          const banned = row.original.banned;
          const verified = row.original.emailVerified;

          return (
            <div className="flex flex-col gap-1">
              {/* Active / Banned */}
              {banned ? (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-red-500"
                >
                  <AlertCircle className="h-4 w-4" />
                  Banned
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-green-500"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Active
                </Badge>
              )}

              {/* Verified */}
              {verified ? (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-green-500"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Verified
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-yellow-500"
                >
                  <AlertCircle className="h-4 w-4" />
                  Not Verified
                </Badge>
              )}
            </div>
          );
        },

        meta: {
          label: "Status",
          variant: "multiSelect",
          options: USER_STATUS.map((banned) => ({ ...banned })),
        },

        enableColumnFilter: true,
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

  const { table } = useDataTable<User>({
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
export default UsersTable;
