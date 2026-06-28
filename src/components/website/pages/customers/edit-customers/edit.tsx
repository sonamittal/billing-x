"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { editCustomerFormSchema } from "@/components/validation/validation";
import type { EditCustomerFormSchema } from "@/components/validation/validation";
import MultiSelect from "@/components/ui/multiselect";
import { CURRENCY_TYPE } from "@/lib/constants";
import { Sal_titles } from "@/lib/constants";
import { GetLanguages } from "react-country-state-city";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Message from "@/components/ui/message";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { GetCustomerById } from "@/app/api/panel/customers/[customerId]/type";
import { SearchCombobox } from "@/components/ui/combobox";

interface CustomerIdProps {
  customer: GetCustomerById;
  callback?: string;
  customerId: string;
}

const EditCustomer = ({ customer, customerId, callback }: CustomerIdProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [languageList, setLanguageList] = useState<any[]>([]);
  // Fetch countries & languages
  useEffect(() => {
    GetLanguages().then((result) => setLanguageList(result));
  }, []);

  // form handling >>>>>>>>>>>
  const form = useForm<EditCustomerFormSchema>({
    resolver: zodResolver(editCustomerFormSchema),
    defaultValues: {
      customerType: customer?.customerType || "",
      companyName: customer?.companyName || "",
      currency: customer?.currency || "",
      language: customer?.language || "",
      email: customer?.email || "",
      workPhone: customer?.workPhone || "",
      mobile: customer?.mobile || "",
    },
  });

  // edit customer form handling >>>>>>>>>>
  const {
    data: editCustomerData,
    mutate: editCustomer,
    isPending: isEditCustomerPending,
    isSuccess: isEditCustomerSuccess,
    error: editCustomerError,
  } = useMutation({
    mutationFn: async (data: EditCustomerFormSchema) => {
      const res = await axios.put(`/api/panel/customers/${customerId}`, {
        id: customerId,
        action: "customer",
        ...data,
      });
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("customer updated successfully!");
      form.reset();
      if (callback) {
        setTimeout(() => {
          router.push(callback);
        }, 1200);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update customer");
    },
  });

  // onSubmit
  const onSubmit = (data: EditCustomerFormSchema) => {
    console.log(" form data sbmitted:", data);
    editCustomer(data);
  };

  return (
    <Card className="pace-y-6 lg:col-span-2 h-fit">
      <CardHeader>
        <CardTitle>Edit customer details</CardTitle>
        <CardDescription>
          Edit customer account details of{" "}
          <span className="text-foreground font-medium">
            {customer?.user?.name + "'s"}
          </span>{" "}
          account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Message
          variant={editCustomerError ? "destructive" : "default"}
          message={editCustomerError?.message}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Type */}
            <FormField
              control={form.control}
              name="customerType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Customer Type<span className="text-red-500">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {/* Company */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ByteWyte" />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Other Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Currency */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Currency <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SearchCombobox
                        options={CURRENCY_TYPE.map((c) => ({
                          label: c.label,
                          value: c.value,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Currency"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Language */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Customer Language <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <SearchCombobox
                        options={languageList.map((lang) => ({
                          label: lang.name,
                          value: lang.name,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select Language"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="eg: john.doe@gmail.com"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Phone */}
            <div className="space-y-3">
              <h3 className="text-md font-medium">Phone No</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="workPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Work phone <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="eg: +918045682231"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mobile <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="eg: +918045682231"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isEditCustomerPending}
            >
              {isEditCustomerPending ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" /> please wait
                </>
              ) : (
                "Update Details"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditCustomer;
