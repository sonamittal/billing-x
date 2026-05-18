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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Message from "@/components/ui/message";
import { is } from "zod/v4/locales";
import { Loader2 } from "lucide-react";

interface customerIdProps {
  customer: any;
  callback?: string;
}

const EditCustomer = ({ customer }: customerIdProps) => {
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
      primaryContact: {
        salutation: customer?.salutation || "",
        firstName: customer?.firstName || "",
        lastName: customer?.lastName || "",
      },
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
      try {
        const res = await axios.put(`/api/panel/customers/${customer.id}`, {
          id: customer.id,
          ...data,
        });
        return res.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to create user",
        );
      }
    },
    onSuccess: () => {
      setTimeout(() => {
        toast.success("customer update details successfully!");
      }, 2000);
    },
  });
  const onSubmit = (data: EditCustomerFormSchema) => {
    console.log(" form data sbmitted:", data);
    editCustomer(data);
  };

  return (
    <Card className="pace-y-6 lg:col-span-2 h-fit">
      <CardHeader>
        <CardTitle>Edit customer details</CardTitle>
        <CardDescription>
          Edit account details of{" "}
          <span className="text-foreground font-medium">
            {" "}
            {customer.firstName} {customer.lastName}
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

            {/* Primary Contact */}
            <div className="space-y-3">
              <h3 className="text-md  font-medium">Primary Contact</h3>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Salutation */}
                <FormField
                  control={form.control}
                  name="primaryContact.salutation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Salutation<span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {Sal_titles.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* First Name */}
                <FormField
                  control={form.control}
                  name="primaryContact.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Riya" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="primaryContact.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Sharma" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
                      <MultiSelect
                        options={CURRENCY_TYPE.map((c) => ({
                          label: c.label,
                          value: c.value,
                        }))}
                        darkBg="secondary"
                        mode="single"
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
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
                      <MultiSelect
                        options={languageList.map((lang) => ({
                          label: lang.name,
                          value: lang.name,
                        }))}
                        darkBg="secondary"
                        mode="single"
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
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
