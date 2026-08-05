"use client";

import { Plus, Trash2, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";

import {
  Form,
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
import { DatePicker } from "@/components/ui/date-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PAYMENT_MODES } from "@/lib/constants";
import axios from "axios";
import {
  editInvoicePaymentSchema,
  type EditInvoicePaymentSchema,
} from "@/components/validation/validation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ApiErrorResponse } from "@/http/type";
import type { invoiceWithRelations } from "@/app/api/panel/invoices/[invoiceId]/type";

interface EditInvoicePaymentProps {
  invoiceId: string;
  invoice: invoiceWithRelations;
  callback?: string;
}

const EditInvoicePayment = ({
  invoiceId,
  invoice,
  callback,
}: EditInvoicePaymentProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<EditInvoicePaymentSchema>({
    resolver: zodResolver(editInvoicePaymentSchema),
    defaultValues: {
      invoiceId,
      customerId: invoice.customerId,
      payments: invoice.payments.map((payment) => ({
        paymentId: payment.id,
        paymentDate: payment.paymentDate,
        paymentMode: payment.paymentMode,
        amountReceived: Number(payment.amountReceived),
      })),
    },
  });

  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "payments",
  });

  const payments =
    useWatch({
      control,
      name: "payments",
    }) ?? [];

  const totalReceived = payments.reduce(
    (sum, payment) => sum + Number(payment.amountReceived || 0),
    0,
  );

  const invoiceTotal = Number(invoice.totalAmount ?? 0);
  const balanceDue = Math.max(0, invoiceTotal - totalReceived);

  // edit payment form  handling >>>>>>>>>>>>>>>
  const { mutate: editPayment, isPending: isEditPaymentPending } = useMutation({
    mutationFn: async (data: EditInvoicePaymentSchema) => {
      const res = await axios.put(
        `/api/panel/invoices/${invoiceId}/payments`,
        data,
      );
      return res.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });

      toast.success(data.message || "Invoice payment has been updated successfully!");
      if (callback) {
        setTimeout(() => {
          router.push(callback);
        }, 1200);
      }
    },

    onError: (error) => {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(
          error.response?.data.message ?? "Failed to edit invoice payments",
        );
      } else {
        toast.error("Failed to create invoice");
      }
    },
  });

  const onSubmit = (data: EditInvoicePaymentSchema) => {
    editPayment(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Edit Payments</CardTitle>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                append({
                  paymentId: "",
                  paymentDate: new Date(),
                  paymentMode: "cash",
                  amountReceived: 0,
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Payment
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                {/* Payment Date */}
                <div className="col-span-3">
                  <FormField
                    control={control}
                    name={`payments.${index}.paymentDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Date</FormLabel>

                        <FormControl>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Payment Mode */}
                <div className="col-span-3">
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
                            options={PAYMENT_MODES}
                            placeholder="Select payment mode"
                            searchPlaceholder="Search payment mode..."
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Amount */}
                <div className="col-span-4">
                  <FormField
                    control={control}
                    name={`payments.${index}.amountReceived`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount Received</FormLabel>

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

            <Button
              type="submit"
              className="w-full"
              disabled={isEditPaymentPending}
            >
              {isEditPaymentPending ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" /> please wait
                </>
              ) : (
                "Update Payments"
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default EditInvoicePayment;
