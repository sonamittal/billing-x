"use client";

import { Trash2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SearchCombobox } from "@/components/ui/invoices-combobox";
import { paymentModes } from "@/lib/constants";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import type { AddInvoiceSchema } from "@/components/validation/validation";

interface InvoicePaymentProps {
  form: UseFormReturn<AddInvoiceSchema>;
}

const InvoicePayment = ({ form }: InvoicePaymentProps) => {
  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "payments",
  });

  const isPaymentReceived = useWatch({
    control,
    name: "isPaymentReceived",
  });

  const totalAmount =
    useWatch({
      control,
      name: "totalAmount",
    }) ?? 0;

  const payments =
    useWatch({
      control,
      name: "payments",
    }) ?? [];

  const totalReceived = payments.reduce(
    (sum, payment) => sum + Number(payment.amountReceived || 0),
    0,
  );

  const balanceDue = Math.max(0, totalAmount - totalReceived);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Split Payments</CardTitle>

        {isPaymentReceived && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              append({
                paymentMode: "cash",
                amountReceived: 0,
              })
            }
          >
            + Add Split Payment
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {isPaymentReceived && (
          <>
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-3 items-end">
                {/* Payment Mode */}
                <div className="col-span-5">
                  <FormField
                    control={control}
                    name={`payments.${index}.paymentMode`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Mode</FormLabel>

                        <FormControl>
                          <SearchCombobox
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select payment mode"
                            searchPlaceholder="Search payment mode..."
                            options={paymentModes}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Amount */}
                <div className="col-span-5">
                  <FormField
                    control={control}
                    name={`payments.${index}.amountReceived`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>

                        <FormControl>
                          <Input
                            type="number"
                            placeholder="₹0.00"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Delete */}
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="w-full"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Received</span>

                <span className="font-semibold text-green-600">
                  ₹{totalReceived.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Balance Due</span>

                <span className="font-semibold text-red-600">
                  ₹{balanceDue.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoicePayment;
