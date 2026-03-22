"use client";

import type { Column } from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  EyeOff,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils";

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  label: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{label}</div>;
  }

  const isSortedAsc = column.getIsSorted() === "asc";
  const isSortedDesc = column.getIsSorted() === "desc";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "-ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
          className,
        )}
        {...props}
      >
        {label}
        {column.getCanSort() && (
          <>
            {isSortedDesc ? (
              <ChevronDown />
            ) : isSortedAsc ? (
              <ChevronUp />
            ) : (
              <ChevronsUpDown />
            )}
          </>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-28">
        {column.getCanSort() && (
          <>
            <DropdownMenuItem
              onClick={() => column.toggleSorting(false)}
              className="flex items-center gap-1"
            >
              <ChevronUp />
              Asc
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => column.toggleSorting(true)}
              className="flex items-center gap-1"
            >
              <ChevronDown />
              Desc
            </DropdownMenuItem>

            {column.getIsSorted() && (
              <DropdownMenuItem
                onClick={() => column.clearSorting()}
                className="flex items-center gap-1"
              >
                <X />
                Reset
              </DropdownMenuItem>
            )}
          </>
        )}

        {column.getCanHide() && (
          <DropdownMenuItem
            onClick={() => column.toggleVisibility(!column.getIsVisible())}
            className="flex items-center gap-1"
          >
            <EyeOff />
            Hide
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
