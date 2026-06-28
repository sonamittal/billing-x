"use client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
};

export function DatePicker({ value, onChange, placeholder }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <span className="truncate">
            {value ? format(value, "dd MMM yyyy") : placeholder}
          </span>

          <CalendarIcon className="h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
      >
        <Calendar
          mode="single"
          selected={value ?? undefined}
          onSelect={(date) => onChange(date ?? null)}
        />
      </PopoverContent>
    </Popover>
  );
}
