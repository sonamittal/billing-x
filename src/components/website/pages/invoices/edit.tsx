"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { SearchCombobox } from "@/components/ui/invoices-combobox";
import EditItemTable from "@/components/website/pages/invoices/edit-item-table";
import InvoiceNumberDialog from "@/components/website/pages/invoices/invoice-number-dailog";
import RichTextEditor from "@/components/ui/text-editor";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  Globe,
  Hash,
  Phone,
  Settings,
  Loader2,
  Receipt,
} from "lucide-react";

import {
  editInvoiceSchema,
  type EditInvoiceSchema,
} from "@/components/validation/validation";
import { invoiceWithRelations } from "@/app/api/panel/invoices/[invoiceId]/type";

interface invoiceIdProps {
  callback?: string;
  invoiceId: string;
  invoice: invoiceWithRelations;
}
interface Customer {
  id: string;
  companyName: string | null;
  email: string | null;
  user: {
    name: string;
    image: string | null;
  } | null;
}

const EditInvoices = ({ invoiceId, invoice, callback }: invoiceIdProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [selectedId, setSelectedId] = useState("");
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);

  // Queries
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await axios.get("/api/panel/customers");
      return res.data;
    },
  });

  const { data: customerDetail, isLoading } = useQuery({
    queryKey: ["customer", selectedId],
    enabled: !!selectedId,
    queryFn: async () => {
      const res = await axios.get(`/api/panel/customers/${selectedId}`);
      return res.data;
    },
  });

  // Form
  const form = useForm<EditInvoiceSchema>({
    resolver: zodResolver(editInvoiceSchema),
    defaultValues: {
      customerId: invoice.customerId,
      invoiceNumber: invoice.invoiceNumber,

      invoiceDate: new Date(invoice.invoiceDate),
      dueDate: new Date(invoice.dueDate),

      subject: invoice.subject ?? "",

      status: invoice.status,

      items: invoice.items.map((item) => ({
        itemName: item.itemName,
        description: item.description,
        unit: item.unit,
        rate: Number(item.rate),
        quantity: Number(item.quantity),
        amount: Number(item.amount),
      })),

      subtotal: Number(invoice.subtotal),
      discount: Number(invoice.discount),
      totalAmount: Number(invoice.totalAmount),

      customerNotes: invoice.customerNotes ?? "",
      termsAndConditions: invoice.termsAndConditions ?? "",
    },
  });

  const items = form.watch("items");
  const discount = form.watch("discount") || 0;

  const subtotal =
    items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.rate),
      0,
    ) || 0;

  const discountAmount = subtotal * (discount / 100);
  const totalAmount = subtotal - discountAmount;

  useEffect(() => {
    form.setValue("subtotal", subtotal);
    form.setValue("totalAmount", totalAmount);
  }, [subtotal, totalAmount, form]);

  // edit ivoice form  handling >>>>>>>>>>>>>>>
  const { mutate: editInvoice, isPending: isEditInvoicePending } = useMutation({
    mutationFn: async (data: EditInvoiceSchema) => {
      const res = await axios.put(`/api/panel/invoices/${invoiceId}`, data);
      return res.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
      toast.success(data.message || "Invoice updated successfully!");
      if (callback) {
        setTimeout(() => {
          router.push(callback);
        }, 1200);
      }
      setSelectedId("");
    },

    onError: () => {
      toast.error("Failed to updated invoice data");
    },
  });

  // Submit
  const onSubmit = (data: EditInvoiceSchema) => {
    editInvoice(data);
  };

  return (
    <>
      <Card className="pace-y-6 lg:col-span-2 h-fit">
        <CardHeader>
          <CardTitle>Edit customer details</CardTitle>
          <CardDescription>
            Edit customer account details of{" "}
            <span className="text-foreground font-medium"></span> account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              {/* Customer */}

              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Customer Name
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="flex-1 w-full relative">
                      <FormControl>
                        <SearchCombobox
                          value={field.value}
                          placeholder="Select Customer"
                          searchPlaceholder="Search customer..."
                          options={customers.map((c) => ({
                            value: c.id,
                            label: c.user?.name ?? "Unknown",
                            image: c.user?.image,
                            email: c.email,
                            companyName: c.companyName,
                          }))}
                          onChange={(value) => {
                            field.onChange(value);
                            setSelectedId(value);
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Billing Address */}
              {customerDetail && (
                <div className="rounded-lg bg-card border p-4  space-y-2 text-sm">
                  {/* Name */}
                  <div className="flex items-center gap-2 font-semibold text-base">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {customerDetail.user?.name}
                  </div>

                  {/* Street */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span>{customerDetail.street1}</span>
                  </div>

                  {/* City + State */}
                  <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span>
                      {customerDetail.city}, {customerDetail.state}
                    </span>
                  </div>

                  {/* Country + PIN */}
                  <div className="flex items-start gap-2">
                    <Hash className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span>
                      {customerDetail.country} - {customerDetail.pinCode}
                    </span>
                  </div>

                  {/* Mobile */}
                  {customerDetail.mobile && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{customerDetail.mobile}</span>
                    </div>
                  )}
                </div>
              )}

              {isLoading && (
                <p className="text-sm text-muted-foreground">
                  Loading address...
                </p>
              )}

              {/* Invoice Details */}
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>

                    <FormControl>
                      <div className="relative">
                        <Input placeholder="INV-0001" {...field} />
                        <Settings
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenInvoiceDialog(true);
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary"
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-4">
                {/* invoice Date */}
                <FormField
                  control={form.control}
                  name="invoiceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Date</FormLabel>

                      <FormControl>
                        <DatePicker
                          value={field.value ?? null}
                          onChange={(date) => field.onChange(date ?? undefined)}
                          placeholder="Select invoice date"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Due Date */}
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>

                      <FormControl>
                        <DatePicker
                          value={field.value ?? null}
                          onChange={(date) => field.onChange(date ?? undefined)}
                          placeholder="Select due date"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* subject */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Website Development Invoice"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* item table */}
              <EditItemTable form={form} />

              {/* Invoice Summary */}
              <div className="flex flex-col-reverse lg:flex-row items-end gap-6">
                <div className="w-full lg:w-[50%]">
                  {/* Customer Notes */}
                  <FormField
                    control={form.control}
                    name="customerNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Add a personal note or message for your customer.
                            This note will be displayed on the invoice."
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full lg:w-[50%]  rounded-xl border bg-background p-6 shadow-sm">
                  <div className="space-y-5">
                    {/* Subtotal */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sub Total</span>
                      <span className="font-medium">
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Discount */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground text-sm">
                        Discount
                      </span>

                      <div className="relative w-32">
                        <FormField
                          control={form.control}
                          name="discount"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  value={field.value}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  placeholder="0"
                                  className="pr-10"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <div className="absolute inset-y-0 right-0 flex items-center border-l px-3 text-sm text-muted-foreground">
                          %
                        </div>
                      </div>

                      <span className="w-20 text-right font-medium">
                        {" "}
                        -₹{discountAmount.toFixed(2)}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t" />

                    {/* Total */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-md font-semibold text-primary">
                        Total
                      </span>

                      <span className="text-lg font-bold text-primary">
                        ₹{totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="">
                <FormField
                  control={form.control}
                  name="termsAndConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms & Conditions</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  className="w-full"
                  type="submit"
                  disabled={isEditInvoicePending}
                >
                  {isEditInvoicePending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Update Details"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <InvoiceNumberDialog
        open={openInvoiceDialog}
        onOpenChange={setOpenInvoiceDialog}
        onSave={(data) => {
          form.setValue("invoiceNumber", data.invoiceNumber);
        }}
      />
    </>
  );
};

export default EditInvoices;
