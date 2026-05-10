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
interface userIdProps {
  user: any;
  callback?: string;
}

const EditCustomer = ({ user }: userIdProps) => {
  const [languageList, setLanguageList] = useState<any[]>([]);
  // Fetch countries & languages
  useEffect(() => {
    GetLanguages().then((result) => setLanguageList(result));
  }, []);

  // form handling >>>>>>>>>>>
  const form = useForm<EditCustomerFormSchema>({
    resolver: zodResolver(editCustomerFormSchema),
    defaultValues: {
      customerType: undefined,
      primaryContact: {
        salutation: "",
        firstName: "",
        lastName: "",
      },
      companyName: "",
      currency: "",
      language: "",
      email: "",
      mobile: "",
      workPhone: "",
    },
  });
  const onSubmit = (data: EditCustomerFormSchema) => {
    console.log(" form data sbmitted:", data);
  };
  return (
    <Card className="pace-y-6 lg:col-span-2 h-fit">
      <CardHeader>
        <CardTitle>Edit customer details</CardTitle>
        <CardDescription>
          Edit account details of{" "}
          <span className="text-foreground font-medium">{user.name}</span>{" "}
          account.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                    <FormLabel>Currency *</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={CURRENCY_TYPE.map((c) => ({
                          label: c.label,
                          value: c.value,
                        }))}
                        value={[field.value]}
                        onChange={(vals) => field.onChange(vals[0] || "INR")}
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
                    <FormLabel>Language *</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={languageList.map((l) => ({
                          label: l.name,
                          value: l.name,
                        }))}
                        value={field.value ? [field.value] : []}
                        onChange={(vals) => field.onChange(vals[0] || "")}
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
                          type="phone"
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
                          type="mobile"
                          placeholder="eg: +918045682231"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Update Details
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditCustomer;
