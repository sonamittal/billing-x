// "use client";
// import React, { useState, useEffect } from "react";
// import { ChevronDown, ChevronUp, Check, X } from "lucide-react";

// interface MultiSelectProps {
//   options: { label: string; value: string }[];
//   value?: string | string[];
//   onChange?: (val: string | string[]) => void;
//   placeholder?: string;
//   disabled?: boolean;
//   mode?: "single" | "multiple";
// }

// const MultiSelect: React.FC<MultiSelectProps> = ({
//   options,
//   value,
//   onChange,
//   placeholder = "Select",
//   disabled = false,
//   mode = "multiple",
// }) => {
//   const isMultiple = mode === "multiple";

//   const [selected, setSelected] = useState<string | string[]>(
//     value ?? (isMultiple ? [] : ""),
//   );

//   const [search, setSearch] = useState("");
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     setSelected(value ?? (isMultiple ? [] : ""));
//   }, [value, isMultiple]);

//   const safeSelected: string[] = isMultiple
//     ? Array.isArray(selected)
//       ? selected
//       : []
//     : [];

//   const filtered = options.filter((o) =>
//     o.label.toLowerCase().includes(search.toLowerCase()),
//   );

//   const toggleSelect = (val: string) => {
//     if (disabled) return;

//     if (isMultiple) {
//       const newValue = safeSelected.includes(val)
//         ? safeSelected.filter((v) => v !== val)
//         : [...safeSelected, val];

//       setSelected(newValue);
//       onChange?.(newValue);

//       // close dropdown after select
//       setOpen(false);
//     } else {
//       const newValue = selected === val ? "" : val;

//       setSelected(newValue);
//       onChange?.(newValue);

//       // close dropdown
//       setOpen(false);
//     }
//   };
//   const selectedSingleLabel = options.find((o) => o.value === selected)?.label;

//   return (
//     <div className="w-full relative">
//       {/* Trigger */}
//       <div
//         onClick={() => !disabled && setOpen(!open)}
//         className={`w-full border rounded-md px-3 py-2 flex justify-between items-center
//         ${
//           disabled
//             ? "bg-gray-100 dark:bg-[#161514] cursor-not-allowed"
//             : "cursor-pointer bg-white dark:bg-[#161514]"
//         }
//         text-black dark:text-white
//         border-gray-300 dark:border-[#34302e]`}
//       >
//         {/* Iunpt area */}
//         <div className="flex flex-wrap gap-1 items-center w-full">
//           {/* Multiple Mode */}
//           {isMultiple ? (
//             safeSelected.length > 0 ? (
//               options
//                 .filter((o) => safeSelected.includes(o.value))
//                 .map((item) => (
//                   <span
//                     key={item.value}
//                     className="flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-[#1f1d1c] text-sm"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     {item.label}

//                     <X
//                       className="w-3 h-3 cursor-pointer hover:text-red-500"
//                       onClick={() => {
//                         const newValue = safeSelected.filter(
//                           (v) => v !== item.value,
//                         );
//                         setSelected(newValue);
//                         onChange?.(newValue);
//                       }}
//                     />
//                   </span>
//                 ))
//             ) : (
//               <span className="text-gray-500 dark:text-gray-400">
//                 {placeholder}
//               </span>
//             )
//           ) : (
//             /* Single mode */
//             <span className="truncate text-gray-700 dark:text-gray-300">
//               {selectedSingleLabel || placeholder}
//             </span>
//           )}
//         </div>

//         {/* Arrow */}
//         {open ? (
//           <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />
//         ) : (
//           <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
//         )}
//       </div>

//       {/* Dropdown */}
//       {open && (
//         <div
//           className="border mt-1 rounded absolute w-full z-10 shadow-md
//           bg-white dark:bg-[#161514]
//           border-gray-300 dark:border-[#34302e]"
//         >
//           {/* Search */}
//           <input
//             className="w-full border-b px-2 py-2 outline-none
//             bg-white dark:bg-[#161514]
//             text-black dark:text-white
//             placeholder:text-gray-500 dark:placeholder:text-gray-400
//             border-gray-300 dark:border-[#34302e]"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           {/* Options */}
//           <div className="max-h-40 overflow-y-auto">
//             {filtered.length > 0 ? (
//               filtered.map((item) => {
//                 const isSelected = isMultiple
//                   ? safeSelected.includes(item.value)
//                   : selected === item.value;

//                 return (
//                   <div
//                     key={item.value}
//                     onClick={() => toggleSelect(item.value)}
//                     className="px-3 py-2 cursor-pointer flex justify-between
//                     text-black dark:text-white
//                     hover:bg-gray-100 dark:hover:bg-[#1f1d1c]"
//                   >
//                     {item.label}

//                     {isSelected && (
//                       <Check className="w-5 h-5 text-[#898989] dark:text-[#9b9797]" />
//                     )}
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
//                 No results found
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MultiSelect;

"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";

interface MultiSelectProps {
  options: { label: string; value: string }[];
  value?: string | string[];
  onChange?: (val: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  mode?: "single" | "multiple";
  darkBg?: "primary" | "secondary";
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select",
  disabled = false,
  mode = "multiple",
  darkBg = "primary",
}) => {
  const isMultiple = mode === "multiple";

  const [selected, setSelected] = useState<string | string[]>(
    value ?? (isMultiple ? [] : ""),
  );

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  // dynamic dark background
  const darkBackground =
    darkBg === "primary" ? "dark:bg-[#161514]" : "dark:bg-[#262321]";

  useEffect(() => {
    setSelected(value ?? (isMultiple ? [] : ""));
  }, [value, isMultiple]);

  const safeSelected: string[] = isMultiple
    ? Array.isArray(selected)
      ? selected
      : []
    : [];

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleSelect = (val: string) => {
    if (disabled) return;

    if (isMultiple) {
      const newValue = safeSelected.includes(val)
        ? safeSelected.filter((v) => v !== val)
        : [...safeSelected, val];

      setSelected(newValue);
      onChange?.(newValue);

      // close dropdown after select
      setOpen(false);
    } else {
      const newValue = selected === val ? "" : val;

      setSelected(newValue);
      onChange?.(newValue);

      // close dropdown
      setOpen(false);
    }
  };

  const selectedSingleLabel = options.find((o) => o.value === selected)?.label;

  return (
    <div className="w-full relative">
      {/* Trigger */}
      <div
        onClick={() => !disabled && setOpen(!open)}
        className={`w-full border rounded-md px-3 py-2 flex justify-between items-center
        ${
          disabled
            ? "bg-gray-100 cursor-not-allowed dark:bg-[#1b1b1b]"
            : `cursor-pointer bg-white ${darkBackground}`
        }
        text-black dark:text-white
        border-gray-300 dark:border-[#34302e]`}
      >
        {/* Input area */}
        <div className="flex flex-wrap gap-1 items-center w-full">
          {/* Multiple Mode */}
          {isMultiple ? (
            safeSelected.length > 0 ? (
              options
                .filter((o) => safeSelected.includes(o.value))
                .map((item) => (
                  <span
                    key={item.value}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-[#1f1d1c] text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.label}

                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-500"
                      onClick={() => {
                        const newValue = safeSelected.filter(
                          (v) => v !== item.value,
                        );

                        setSelected(newValue);
                        onChange?.(newValue);
                      }}
                    />
                  </span>
                ))
            ) : (
              <span className="text-gray-500 text-sm dark:text-gray-400">
                {placeholder}
              </span>
            )
          ) : (
            /* Single mode */
            <span className="truncate text-gray-700 dark:text-gray-200 text-sm">
              {selectedSingleLabel || placeholder}
            </span>
          )}
        </div>

        {/* Arrow */}
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className={`border mt-1 rounded absolute w-full z-10 shadow-md
          bg-white ${darkBackground}
          border-gray-300 dark:border-[#34302e]`}
        >
          {/* Search */}
          <input
            className={`w-full border-b px-2 py-2 outline-none
            bg-white ${darkBackground}
            text-black dark:text-white
            placeholder:text-gray-500 dark:placeholder:text-gray-400
            border-gray-300 dark:border-[#34302e]`}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Options */}
          <div className="max-h-40 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((item) => {
                const isSelected = isMultiple
                  ? safeSelected.includes(item.value)
                  : selected === item.value;

                return (
                  <div
                    key={item.value}
                    onClick={() => toggleSelect(item.value)}
                    className="px-3 py-2 cursor-pointer flex justify-between text-sm
                    text-black dark:text-white
                    hover:bg-gray-100 dark:hover:bg-[#1f1d1c]"
                  >
                    {item.label}

                    {isSelected && (
                      <Check className="w-5 h-5 text-[#898989] dark:text-[#9b9797]" />
                    )}
                  </div>
                );
              })
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
