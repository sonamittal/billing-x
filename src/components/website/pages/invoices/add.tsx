"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { addInvoiceSchema } from "@/components/validation/validation";
import type { AddInvoiceSchema } from "@/components/validation/validation";
import { SearchCombobox } from "@/components/ui/invoices-combobox";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import type { ApiErrorResponse } from "@/http/type";
import {
  User,
  MapPin,
  Globe,
  Hash,
  Phone,
  Settings,
  Loader2,
  Receipt,
  Minus,
} from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import Message from "@/components/ui/message";
import ItemTable from "@/components/website/pages/invoices/item-table";
import InvoiceNumberDialog from "@/components/website/pages/invoices/invoice-number-dailog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CustomerList = {
  id: string;
  user: {
    name: string;
    image: string | null;
  } | null;
  email: string | null;
  companyName: string | null;
};
type CustomerDetail = {
  id: string;
  country: string | null;
  state: string | null;
  city: string | null;
  pinCode: string | null;
  street1: string | null;
  mobile: string | null;
  user: {
    name: string;
    image: string | null;
  } | null;
};

const AddInvoices = ({ open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string>("");
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [submitType, setSubmitType] = useState<"draft" | "sent" | null>(null);

  // fetch data
  const { data: customers = [] } = useQuery<CustomerList[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await axios.get("/api/panel/customers");
      return res.data;
    },
  });

  const { data: customerDetail, isLoading } = useQuery<CustomerDetail>({
    queryKey: ["customer", selectedId],
    enabled: !!selectedId,
    queryFn: async () => {
      const res = await axios.get(`/api/panel/customers/${selectedId}`);
      return res.data;
    },
  });
  // form handling >>>>>>>>>>>
  const form = useForm<AddInvoiceSchema>({
    resolver: zodResolver(addInvoiceSchema),
    defaultValues: {
      customerId: "",
      invoiceNumber: "",
      invoiceDate: undefined,
      dueDate: undefined,
      subject: "",
      status: "draft",
      items: [
        {
          itemName: "",
          description: "",
          unit: undefined,
          quantity: 1,
          rate: 0,
          amount: 0,
        },
      ],
      subtotal: 0,
      discount: 0,
      totalAmount: 0,
      customerNotes: "",
      termsAndConditions: "",
    },
  });
  // total
  const discount = form.watch("discount") || 0;

  const items = form.watch("items") || [];

  const subtotal =
    items?.reduce((total, item) => {
      return total + Number(item.quantity || 0) * Number(item.rate || 0);
    }, 0) || 0;

  const discountAmount = (subtotal * discount) / 100;

  const totalAmount = subtotal - discountAmount;

  // set val
  const { setValue } = form;

  //useEffect
  useEffect(() => {
    setValue("subtotal", subtotal, {
      shouldDirty: false,
      shouldValidate: false,
    });

    setValue("totalAmount", totalAmount, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [subtotal, totalAmount, setValue]);

  // add invoice form handling >>>>>>>>>>>
  const {
    mutate: AddInvoice,
    isPending: isAddInvoicePending,
    isSuccess: isAddInvoiceSuccess,
    error: addInvoiceError,
  } = useMutation({
    mutationFn: async (data: AddInvoiceSchema) => {
      const res = await axios.post("/api/panel/invoices", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success(data.message || "Invoice created successfully!");
      form.reset();
      setSelectedId("");
      setSubmitType(null);
      onOpenChange(false);
    },

    onError: (error) => {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        toast.error(error.response?.data.message ?? "Failed to create invoice");
      } else {
        toast.error("Failed to create invoice");
      }
      setSubmitType(null);
    },
  });

  // Submit
  const submitInvoice = (status: "draft" | "sent") => {
    setSubmitType(status);
    form.handleSubmit((data) => {
      AddInvoice({
        ...data,
        status,
      });
    })();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="overflow-auto w-[60%] md:max-w-[85%] xl:max-w-[70%] max-h-[90vh]">
          <DialogHeader className="text-start">
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" /> Add Invoice
            </DialogTitle>
            <DialogDescription>
              Fill in the invoice details and save it as a draft or send it to
              the customer.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-7">
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
              <ItemTable form={form} />

              {/* Invoice Summary */}
              <div className="flex flex-col-reverse lg:flex-row  items-end justify-end gap-6">
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
                        - ₹{discountAmount.toFixed(2)}
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
                        <Textarea
                          {...field}
                          placeholder="Enter the terms and conditions of your business to be displayed on the invoice."
                          rows={4}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  disabled={isAddInvoicePending}
                  variant="outline"
                  onClick={() => submitInvoice("draft")}
                >
                  {isAddInvoicePending && submitType === "draft" ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      please wait
                    </>
                  ) : (
                    "Save as Draft"
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={() => submitInvoice("sent")}
                  disabled={isAddInvoicePending}
                >
                  {isAddInvoicePending && submitType === "sent" ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" /> please
                      wait
                    </>
                  ) : (
                    "Save & Send"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Invoice Number Dialog */}
      <InvoiceNumberDialog
        open={openInvoiceDialog}
        onOpenChange={setOpenInvoiceDialog}
        onSave={(data) => {
          setValue("invoiceNumber", data.invoiceNumber, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
      />
    </>
  );
};

export default AddInvoices;
