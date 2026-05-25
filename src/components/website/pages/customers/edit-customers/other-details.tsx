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
import { Plus, Upload, Trash2, Loader2 } from "lucide-react";
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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import Message from "@/components/ui/message";
interface OtherDetailsFormProps {
  customerId: string;
  customerData?: any;
}
// uploadFile
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post("/api/upload", formData);
  return res.data.url; // S3 URL
};

const OtherDetailsForm = ({
  customerId,
  customerData,
}: OtherDetailsFormProps) => {
  const [open, setOpen] = useState(false);
  const [paymentTerms, setPaymentTerms] = useState(Payment_Terms);

  // form handling >>>>>>>>>>
  const form = useForm<OtherDetailsSchema>({
    resolver: zodResolver(otherDetailsSchema),
    defaultValues: {
      pan: customerData?.pan || "",
      paymentTerms: customerData?.paymentTerms || "",
      documents: customerData?.documents || [],
      websiteURL: customerData?.websiteUrl || "",
      department: customerData?.department || "",
      designation: customerData?.designation || "",
      x: customerData?.x || "",
      facebook: customerData?.facebook || "",
    },
  });
  // edit other details  customer form handling >>>>>>>>>>
  const {
    data: editODCustomerData,
    mutate: editODCustomer,
    isPending: isEditODCustomerPending,
    isSuccess: isEditODCustomerSuccess,
    error: editODCustomerError,
  } = useMutation({
    mutationFn: async (data: OtherDetailsSchema) => {
      // 1. upload files first
      const uploadedUrls = await Promise.all(
        (data.documents ?? []).map(async (file: any) => {
          if (typeof file === "string") {
            return file;
          }
          return await uploadFile(file);
        }),
      );
      // api request
      const res = await axios.put(`/api/panel/customers/${customerId}`, {
        id: customerId,
        action: "otherDetails",
        ...data,
        documents: uploadedUrls,
      });

      return res.data;
    },
    onSuccess: () => {
      toast.success("Customer  other details updated successfully");
    },

    onError: (err: any) => {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });
  const onSubmit = (data: OtherDetailsSchema) => {
    console.log(" form data sbmitted:", data);
    editODCustomer(data);
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
              <Button
                type="submit"
                className="w-full"
                disabled={isEditODCustomerPending}
              >
                {isEditODCustomerPending ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" /> please
                    wait
                  </>
                ) : (
                  "Submit"
                )}
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
