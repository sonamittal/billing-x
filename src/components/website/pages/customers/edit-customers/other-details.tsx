"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  otherDetailsSchema,
  type OtherDetailsSchema,
} from "@/components/validation/validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Payment_Terms } from "@/lib/constants";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import MultiSelect from "@/components/ui/multiselect";

const OtherDetailsForm = () => {
  const form = useForm<OtherDetailsSchema>({
    resolver: zodResolver(otherDetailsSchema),
    defaultValues: {
      pan: "",
      paymentTerms: "",
      documents: "",
      websiteURL: "",
      department: "",
      designation: "",
      x: "",
      facebook: "",
    },
  });

  const onSubmit = (data: OtherDetailsSchema) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-4 pb-6"
      >
        {/* PAN */}
        <FormField
          control={form.control}
          name="pan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                PAN <span className="text-red-500">*</span>
              </FormLabel>

              <FormControl>
                <Input placeholder="Enter PAN" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Terms */}
        <FormField
          control={form.control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Terms *</FormLabel>

              <FormControl>
                <MultiSelect
                  mode="single"
                  options={Payment_Terms}
                  value={field.value}
                  onChange={(val) => field.onChange(val)}
                  placeholder="Select payment terms"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Documents */}
        <FormField
          control={form.control}
          name="documents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Documents <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Due on Receipt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Website URL */}
        <FormField
          control={form.control}
          name="websiteURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Website URL <span className="text-red-500">*</span>
              </FormLabel>

              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid md:grid-cols-2 gap-4">
          {/* Department */}
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Department <span className="text-red-500">*</span>
                </FormLabel>

                <FormControl>
                  <Input placeholder="Enter department" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Designation */}
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Designation <span className="text-red-500">*</span>
                </FormLabel>

                <FormControl>
                  <Input placeholder="Enter designation" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {/* X */}
          <FormField
            control={form.control}
            name="x"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  X <span className="text-red-500">*</span>
                </FormLabel>

                <FormControl>
                  <Input placeholder="https://x.com/" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {/* facebook */}
          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Facebook <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="http://www.facebook.com/" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Submit */}
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default OtherDetailsForm;
