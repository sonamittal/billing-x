"use client";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { EditInvoiceSchema } from "@/components/validation/validation";
import { SearchCombobox } from "@/components/ui/combobox";
import { units } from "@/lib/constants";
import { useEffect } from "react";

interface EditItemTableProps {
  form: UseFormReturn<EditInvoiceSchema>;
}

const EditItemTable = ({ form }: EditItemTableProps) => {
  const { control, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({
    control,
    name: "items",
  });

  // useEffect
  useEffect(() => {
    items?.forEach((item, index) => {
      const quantity = Number(item?.quantity ?? 0);
      const rate = Number(item?.rate ?? 0);
      const amount = quantity * rate;

      if (item?.amount !== amount) {
        setValue(`items.${index}.amount`, amount, {
          shouldDirty: false,
          shouldValidate: false,
        });
      }
    });
  }, [items, setValue]);

  return (
    <div className="border rounded-md bg-[#1C1917]">
      <div className="border-b px-5 py-3">
        <h2 className="text-lg  font-semibold">Item Table</h2>
      </div>

      <div className="overflow-x-auto rounded-md border-b">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border p-3">Item Name</th>
              <th className="border p-3">Description</th>
              <th className="border p-3">Unit</th>
              <th className="border p-3">Quantity</th>
              <th className="border p-3">Rate</th>
              <th className="border p-3">Amount</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {fields.map((fieldItem, index) => {
              const amount = items?.[index]?.amount ?? 0;

              return (
                <tr key={fieldItem.id}>
                  <td className="border p-3">
                    <FormField
                      control={control}
                      name={`items.${index}.itemName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Laptop Dell Inspiron 15"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>

                  <td className="border p-3">
                    <FormField
                      control={control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Intel i5, 16GB RAM, 512GB SSD"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>

                  <td className="border p-3">
                    <FormField
                      control={control}
                      name={`items.${index}.unit`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SearchCombobox
                              value={field.value}
                              onChange={field.onChange}
                              options={units}
                              placeholder="Select a Unit"
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>

                  <td className="border p-3">
                    <FormField
                      control={control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value ?? 1}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? 1
                                    : Number(e.target.value),
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>

                  <td className="border p-3">
                    <FormField
                      control={control}
                      name={`items.${index}.rate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              value={field.value ?? 0}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? 0
                                    : Number(e.target.value),
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>

                  <td className="border p-3">
                    <div className="h-9 rounded-md border px-3 flex items-center">
                      ₹{amount.toFixed(2)}
                    </div>
                  </td>

                  <td className="border p-3 text-center">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-4">
        <Button
          type="button"
          onClick={() =>
            append({
              itemName: "",
              description: "",
              unit: "pcs",
              quantity: 1,
              rate: 0,
              amount: 0,
            })
          }
        >
          + Add Item
        </Button>
      </div>
    </div>
  );
};

export default EditItemTable;
