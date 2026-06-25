// "use client";

// import * as React from "react";
// import { Check, ChevronsUpDown } from "lucide-react";

// import { cn } from "@/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// export interface ComboboxOption {
//   label: string;
//   value: string;
// }

// interface SearchComboboxProps {
//   value: string;
//   onChange: (value: string) => void;
//   options: ComboboxOption[];
//   placeholder?: string;
//   searchPlaceholder?: string;
//   emptyMessage?: string;
// }

// export function SearchCombobox({
//   value,
//   onChange,
//   options,
//   placeholder = "Select option",
//   searchPlaceholder = "Search...",
//   emptyMessage = "No data found",
// }: SearchComboboxProps) {
//   const [open, setOpen] = React.useState(false);

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           type="button"
//           variant="outline"
//           role="combobox"
//           className="w-full justify-between"
//         >
//           {value
//             ? options.find((item) => item.value === value)?.label
//             : placeholder}

//           <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
//         </Button>
//       </PopoverTrigger>

//       <PopoverContent className="w-full p-0">
//         <Command>
//           <CommandInput placeholder={searchPlaceholder} />

//           <CommandList>
//             <CommandEmpty>{emptyMessage}</CommandEmpty>

//             <CommandGroup>
//               {options.map((option) => (
//                 <CommandItem
//                   key={option.value}
//                   value={option.label}
//                   onSelect={() => {
//                     onChange(option.value);
//                     setOpen(false);
//                   }}
//                 >
//                   <Check
//                     className={cn(
//                       "mr-2 h-4 w-4",
//                       value === option.value
//                         ? "opacity-100"
//                         : "opacity-0"
//                     )}
//                   />

//                   {option.label}
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
  image?: string | null;
  email?: string | null;
  companyName?: string | null;
}

interface SearchComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function SearchCombobox({
  value,
  onChange,
  options,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  emptyMessage = "No data found",
}: SearchComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selected = options.find((item) => item.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="w-full flex justify-between"
        >
          {selected ? (
            <div className="flex items-center gap-2 overflow-hidden">
              {selected.image ? (
                <img
                  src={selected.image}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  {selected.label?.charAt(0)}
                </div>
              )}

              <span className="truncate">{selected.label}</span>
            </div>
          ) : (
            <span>{placeholder}</span>
          )}

          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        style={{ width: "var(--radix-popper-anchor-width)" }}
        className="p-0"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />

          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.email ?? ""} ${option.companyName ?? ""}`}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3"
                >
                  {option.image ? (
                    <img
                      src={option.image}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      {option.label?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex flex-col flex-1">
                    <span className="font-medium">{option.label}</span>

                    <span className="text-xs text-muted-foreground">
                      {option.email}
                      {option.companyName && (
                        <>
                          <span className="mx-1">|</span>
                          {option.companyName}
                        </>
                      )}
                    </span>
                  </div>

                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
