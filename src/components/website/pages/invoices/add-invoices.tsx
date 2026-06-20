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
import MultiSelect from "@/components/ui/multiselect";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Search ,Receipt  } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Message from "@/components/ui/message";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Customer = {
  id: string;
  name: string;
  street1: string;
  city: string;
  state: string;
  pinCode: string;
};

const customers: Customer[] = [
  {
    id: "1",
    name: "Mrs. Rashi Tyagi",
    street1: "Sector 15",
    city: "Noida",
    state: "Uttar Pradesh",
    pinCode: "201301",
  },
  {
    id: "2",
    name: "John Doe",
    street1: "MG Road",
    city: "Delhi",
    state: "Delhi",
    pinCode: "110001",
  },
];

const AddInvoices = ({ open, onOpenChange }: Props) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const form = useForm<AddInvoiceSchema>({
    resolver: zodResolver(addInvoiceSchema),
    defaultValues: {
      customerName: "",
      invoiceNumber: "",
      invoiceDate: new Date(),
      dueDate: new Date(),
      subject: "",
      attachments: [],
      subtotal: 0,
      discount: 0,
      totalAmount: 0,
      customerNotes: "",
      termsAndConditions: "",
    },
  });

  const onSubmit = (data: AddInvoiceSchema) => {
    console.log("form data sbmitted:", data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Invoice</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer */}

            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Customer Name
                    <span className="text-red-500">*</span>
                  </FormLabel>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <FormControl>
                        <MultiSelect
                          mode="single"
                          value={field.value}
                          placeholder="Select Customer"
                          options={customers.map((customer) => ({
                            label: customer.name,
                            value: customer.id,
                          }))}
                          onChange={(value) => {
                            field.onChange(value);

                            const customer = customers.find(
                              (item) => item.id === value,
                            );

                            setSelectedCustomer(customer || null);
                          }}
                        />
                      </FormControl>
                    </div>

                    <Button size="icon" type="button">
                      <Search className="h-4 w-4" />
                    </Button>

                    <Button type="button" variant="outline">
                      INR
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Billing Address */}

            {selectedCustomer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">BILLING ADDRESS</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p>{selectedCustomer.name}</p>
                    <p>{selectedCustomer.street1}</p>
                    <p>
                      {selectedCustomer.city}, {selectedCustomer.state}
                    </p>
                    <p>{selectedCustomer.pinCode}</p>
                  </div>

                  <Button type="button" variant="link" className="px-0 mt-2">
                    New Address
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Invoice Details */}

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>

                    <FormControl>
                      <Input placeholder="INV-0001" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoiceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Date</FormLabel>

                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>

                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </div>

            {/* Amounts */}

            <div className="grid md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="subtotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtotal</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}

            <FormField
              control={form.control}
              name="customerNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Notes</FormLabel>

                  <FormControl>
                    <textarea
                      className="w-full min-h-[100px] border rounded-md p-3"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="termsAndConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms & Conditions</FormLabel>

                  <FormControl>
                    <textarea
                      className="w-full min-h-[100px] border rounded-md p-3"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create Invoice</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddInvoices;
