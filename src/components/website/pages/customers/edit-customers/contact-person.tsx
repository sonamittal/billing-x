"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { editContactPersonSchema } from "@/components/validation/validation";
import type { EditContactPersonSchema } from "@/components/validation/validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sal_titles } from "@/lib/constants";

const EditContactPersonForm = () => {
  const form = useForm<EditContactPersonSchema>({
    resolver: zodResolver(editContactPersonSchema),
    defaultValues: {
      salutation: "",
      firstName: "",
      lastName: "",
      email: "",
      workPhone: "",
      mobile: "",
      designation: "",
      department: "",
    },
  });

  const onSubmit = (data: EditContactPersonSchema) => {
    console.log("Form Data Submitted:", data);
  };
  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Primary Contact */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Salutation */}
              <FormField
                control={form.control}
                name="salutation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Salutation<span className="text-red-500">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
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
                name="firstName"
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
                name="lastName"
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
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    designation <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="eg: Customer Service Executive"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    department <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="eg: Customer Service"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Update Details
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default EditContactPersonForm;
