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
import { Plus, Upload, Trash2 } from "lucide-react";
import { useState } from "react";
import MultiSelect from "@/components/ui/multiselect";
import AddNewPayTForm from "@/components/website/pages/customers/edit-customers/add-payemt-trems";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
  FileUploadClear,
} from "@/components/ui/file-upload";

const OtherDetailsForm = () => {
  const [open, setOpen] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState(Payment_Terms);
  const form = useForm<OtherDetailsSchema>({
    resolver: zodResolver(otherDetailsSchema),
    defaultValues: {
      pan: "",
      paymentTerms: "",
      documents: [],
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
              {/* <FormField
                control={form.control}
                name="documents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Documents <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <FileUpload
                        value={field.value || []}
                        onValueChange={field.onChange}
                        accept="image/*,.pdf"
                        multiple
                      >
                        <FileUploadDropzone />
                        <FileUploadTrigger />

                        <FileUploadList>
                          {(field.value || []).map((file: File) => (
                            <FileUploadItem key={file.name} value={file}>
                              <FileUploadItemPreview />
                              <FileUploadItemMetadata />
                              <FileUploadItemProgress />
                              <FileUploadItemDelete />
                            </FileUploadItem>
                          ))}
                        </FileUploadList>

                        <FileUploadClear />
                      </FileUpload>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              /> */}

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
                      <FileUpload
                        value={field.value || []}
                        onValueChange={field.onChange}
                        accept="image/*,.pdf"
                        multiple
                        className="w-full"
                      >
                        {/* Dropzone */}
                        <FileUploadDropzone className="border-2 border-dashed rounded-lg p-5 text-center bg-muted/30">
                          <div className="flex flex-col items-center gap-3">
                            <Upload className="w-10 h-10 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                Drag & Drop files here
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Upload images or PDF files
                              </p>
                            </div>
                          </div>
                        </FileUploadDropzone>

                        {/* Uploaded Files */}
                        <FileUploadList className="mt-4">
                          {(field.value || []).map((file: File) => (
                            <FileUploadItem
                              key={file.name}
                              value={file}
                              className="flex items-center gap-3 border rounded-md p-3"
                            >
                              <FileUploadItemPreview />
                              <div className="flex-1">
                                <FileUploadItemMetadata />
                                <FileUploadItemProgress className="mt-2" />
                              </div>
                              <FileUploadItemDelete className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </FileUploadItemDelete>
                            </FileUploadItem>
                          ))}
                        </FileUploadList>
                      </FileUpload>
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
