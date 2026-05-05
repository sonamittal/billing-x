"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

interface MultiSelectProps {
  options: { label: string; value: string }[];
  value?: string[];
  onChange?: (vals: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  disabled = false,
}) => {
  const [selected, setSelected] = useState<string[]>(value);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleSelect = (val: string) => {
    if (disabled) return;

    let newSelected: string[];

    if (selected.includes(val)) {
      newSelected = selected.filter((v) => v !== val);
    } else {
      newSelected = [val];
    }

    setSelected(newSelected);
    onChange?.(newSelected);
    setOpen(false);
  };

  const selectedLabels = options
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label);

  return (
    <div className="w-full relative">
      {/* Trigger */}
      <div
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full border rounded-md px-3 py-2 flex justify-between items-center
        ${
          disabled
            ? "bg-gray-100 dark:bg-[#161514] cursor-not-allowed"
            : "cursor-pointer bg-white dark:bg-[#161514]"
        }
        text-black dark:text-white
        border-gray-300 dark:border-[#34302e]`}
      >
        <span className="truncate text-gray-700 dark:text-gray-300">
          {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
        </span>

        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        )}
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <div
          className="border mt-1 rounded absolute w-full z-10 shadow-md
          bg-white dark:bg-[#161514]
          border-gray-300 dark:border-[#34302e]"
        >
          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full border-b px-2 py-2 outline-none
            bg-white dark:bg-[#161514]
            text-black dark:text-white
            placeholder:text-gray-500 dark:placeholder:text-gray-400
            border-gray-300 dark:border-[#34302e]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Options */}
          <div className="max-h-40 overflow-auto">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item.value}
                  onClick={() => toggleSelect(item.value)}
                  className="px-3 py-2 cursor-pointer flex justify-between
                  text-black dark:text-white
                  hover:bg-gray-100 dark:hover:bg-[#1f1d1c]"
                >
                  {item.label}
                  {selected.includes(item.value) && (
                    <Check className=" w-5 h-5 text-[#898989] dark:text-[#9b9797]" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
