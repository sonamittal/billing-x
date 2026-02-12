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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataTable } from "@/hooks/use-data-table";
import { USER_ROLES } from "@/lib/constants";

interface User {
  id: string;
  username: string;
  email: string;
  status: "active" | "inactive" | "suspended";
  role: "admin" | "staff" | "staffAssigned" | "timesheetStaff";
}

const data: User[] = [
  {
    id: "1",
    username: "johndoe",
    email: "john@example.com",
    status: "active",
    role: "admin",
  },
  {
    id: "2",
    username: "janedoe",
    email: "jane@example.com",
    status: "suspended",
    role: "staff",
  },
  {
    id: "3",
    username: "janedoe",
    email: "jane@example.com",
    status: "inactive",
    role: "staffAssigned",
  },
  {
    id: "4",
    username: "mike",
    email: "mike@example.com",
    status: "active",
    role: "timesheetStaff",
  },
];

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

  // Ideally we would filter the data server-side, but for the sake of this example, we'll filter the data client-side
  const filteredData = React.useMemo(() => {
    return data.filter((user) => {
      const matchUsername =
        username === "" ||
        user.username.toLowerCase().includes(username.toLowerCase());
      const matchesStatus = status.length === 0 || status.includes(user.status);
      const matchesRole = role.length === 0 || role.includes(user.role);
      return matchUsername && matchesStatus && matchesRole;
    });
  }, [username, status, role]);

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

          const statusConfig = {
            active: {
              icon: CheckCircle2,
              className: "text-green-500",
            },
            inactive: {
              icon: XCircle,
              className: "text-gray-500",
            },
            suspended: {
              icon: AlertCircle,
              className: "text-red-500",
            },
          } as const;

          const { icon: Icon, className } = statusConfig[status];
          return (
            <Badge
              variant="outline"
              className={`capitalize flex items-center gap-1 ${className}`}
            >
              <Icon className="h-4 w-4" />
              {status}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: [
            { label: "Active", value: "active", icon: CheckCircle },
            { label: "Inactive", value: "inactive", icon: XCircle },
            { label: "Suspended", value: "suspended", icon: AlertCircle },
          ],
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
    pageCount: 1,
    initialState: {
      sorting: [{ id: "username", desc: false }],
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
export default UsersTable;
