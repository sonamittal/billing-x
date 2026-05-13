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
import { Payment_Terms } from "@/lib/constants";
import { Plus } from "lucide-react";
import { useState } from "react";
import MultiSelect from "@/components/ui/multiselect";
import AddNewPayTForm from "@/components/website/pages/customers/edit-customers/add-payemt-trems";
import ImageUpload from "@/components/ui/image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OtherDetailsForm = () => {
  const [open, setOpen] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState(Payment_Terms);
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
    <>
      <Card>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <div className="grid  md:grid-col-2 gap-3 lg:grid-cols-[70%_30%]">
                      <FormControl>
                        <MultiSelect
                          darkBg="secondary"
                          mode="single"
                          options={paymentTerms}
                          value={field.value}
                          onChange={(val) => field.onChange(val)}
                          placeholder="Select payment terms"
                        />
                      </FormControl>
                      <Button type="button" onClick={() => setOpen(true)}>
                        <Plus className=" text-red-500 w-4 h-4" />
                        Add New payment term
                      </Button>
                    </div>
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
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        maxUploadSize={5}
                        uploadApi={"/api/panel/images/upload"}
                        uploadAction={"uploadImage"}
                      />
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
                        <Input
                          placeholder="http://www.facebook.com/"
                          {...field}
                        />
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
          <AddNewPayTForm
            open={open}
            onOpenChange={setOpen}
            onAddPaymentTerm={(newTerm) => {
              // add payment term option
              setPaymentTerms((prev) => [
                ...prev,
                {
                  label: newTerm.termName,
                  value: newTerm.termName,
                },
              ]);
              form.setValue("paymentTerms", newTerm.termName);
            }}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default OtherDetailsForm;
