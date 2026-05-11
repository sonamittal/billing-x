"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { contactPersonsSchema } from "@/components/validation/validation";
import type { ContactPersonsSchema } from "@/components/validation/validation";
import { Sal_titles } from "@/lib/constants";

const ContactPersonTable = () => {
  const form = useForm<ContactPersonsSchema>({
    resolver: zodResolver(contactPersonsSchema),

    defaultValues: {
      contacts: [
        {
          salutation: "",
          firstName: "",
          lastName: "",
          email: "",
          workPhone: "",
          mobile: "",
          designation: "",
          department: "",
        },
      ],
    },
  });

  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  const onSubmit = (data: ContactPersonsSchema) => {
    console.log("Submitted Data:", data);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* TABLE */}
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="">
                  <th className="border p-3 min-w-35">Salutation</th>

                  <th className="border p-3 min-w-45">First Name</th>

                  <th className="border p-3 min-w-45">Last Name</th>

                  <th className="border p-3 min-w-62.5">Email</th>

                  <th className="border p-3 min-w-45">Work Phone</th>

                  <th className="border p-3 min-w-45">Mobile</th>

                  <th className="border p-3 min-w-55">Designation</th>

                  <th className="border p-3 min-w-55">Department</th>

                  <th className="border p-3 min-w-30">Action</th>
                </tr>
              </thead>

              <tbody>
                {fields.map((item, index) => (
                  <tr key={item.id} className="align-top">
                    {/* SALUTATION */}
                    <td className="border p-3">
                      <FormField
                        control={control}
                        name={`contacts.${index}.salutation`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                {Sal_titles.map((s) => (
                                  <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>

                    {/* FIRST NAME */}
                    <td className="border p-3">
                      <FormField
                        control={control}
                        name={`contacts.${index}.firstName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Neha" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>

                    {/* LAST NAME */}
                    <td className="border p-3">
                      <FormField
                        control={control}
                        name={`contacts.${index}.lastName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Jain" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>

                    {/* EMAIL */}
                    <td className="border p-3">
                      <FormField
                        control={control}
                        name={`contacts.${index}.email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="email"
                                {...field}
                                placeholder="john@example.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>

                    {/* WORK PHONE */}
                    <td className="border p-3">
                      <FormField
                        control={control}
                        name={`contacts.${index}.workPhone`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="+91 9876543210" />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>

                    {/* MOBILE */}
                    <td className="border p-3">
                      <FormField
                        control={control}
                        name={`contacts.${index}.mobile`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="+91 9876543210" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>

                    {/* DESIGNATION */}
                    <td className="border p-3">
                      <FormField
                        control={control}
                        name={`contacts.${index}.designation`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Manager" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>

                    {/* DEPARTMENT */}
                    <td className="border p-3">
                      <FormField
                        control={control}
                        name={`contacts.${index}.department`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Sales" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </td>

                    {/* DELETE BUTTON */}
                    <td className="border p-3 text-center">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() =>
                append({
                  salutation: "",
                  firstName: "",
                  lastName: "",
                  email: "",
                  workPhone: "",
                  mobile: "",
                  designation: "",
                  department: "",
                })
              }
            >
              + Add Contact Person
            </Button>

            <Button type="submit">Save All</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContactPersonTable;
