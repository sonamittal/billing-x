"use client";
import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  CheckCircle2,
  MoreHorizontal,
  Text,
  XCircle,
  Pencil,
  Trash2,
  AlertCircle,
  Mail,
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
  status: "active" | "inactive" | "suspended";
  role: "admin" | "staff" | "staffAssigned" | "timesheetStaff";
}

const UsersTable = () => {
  const [username] = useQueryState("username", parseAsString.withDefault(""));
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const [role] = useQueryState(
    "role",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  //Fetch users
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
        status:
          u.data?.status ??
          (Array.isArray(u.status) ? u.status[0] : u.status) ??
          "active",
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
      const matchesStatus = status.length === 0 || status.includes(user.status);
      const matchesRole = role.length === 0 || role.includes(user.role);
      return matchUsername && matchesStatus && matchesRole;
    });
  }, [users, username, status, role]);

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
        id: "status",
        accessorKey: "status",
        header: ({ column }: { column: Column<User, unknown> }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<User["status"]>();

          // Define status configurations
          const statusConfig = {
            active: { icon: CheckCircle2, className: "text-green-500" },
            inactive: { icon: XCircle, className: "text-gray-500" },
            suspended: { icon: AlertCircle, className: "text-red-500" },
          } as const;

          const { icon: Icon, className } = statusConfig[
            status as keyof typeof statusConfig
          ] ?? {
            icon: AlertCircle,
            className: "text-gray-400",
          };

          return (
            <Badge
              variant="outline"
              className={`capitalize flex items-center gap-1 ${className}`}
            >
              <Icon className="h-4 w-4" />
              {status ?? "unknown"}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: USER_STATUS.map((status) => ({ ...status })), // Your multi-select options
        },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        cell: function Cell() {
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
                  <Pencil />
                  Edit
                  {/* <Link href={"/panel/user/[userId]"}>Edit</Link> */}
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <Trash2 />
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

  const { table } = useDataTable({
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
