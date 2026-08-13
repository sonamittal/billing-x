"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
import MultiSelect from "@/components/ui/multiselect";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import Message from "@/components/ui/message";

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
} from "@/components/ui/file-upload";
import { Plus, Upload, Trash2, Loader2, FileText } from "lucide-react";
import type { GetCustomerById } from "@/app/api/panel/customers/[customerId]/type";


interface OtherDetailsFormProps {
  customerId: string;
  customer: GetCustomerById;
  callback?: string;
}

type UploadedDocument = {
  url: string;
  key: string;
  name?: string;
};

type DocumentType = File | UploadedDocument;

// upload file >>>>>>>>>>>>>>>>>>>>
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post("/api/panel/images/upload", formData);
  return res.data;
};

// delete file >>>>>>>>>>>>>>>>>>>>
const deleteFile = async (key: string) => {
  await axios.post("/api/panel/images/delete", {
    key,
  });
};

const OtherDetailsForm = ({ customerId, customer }: OtherDetailsFormProps) => {
  const queryClient = useQueryClient();

  // form handling >>>>>>>>>>>>>>>>>>>>
  const form = useForm<OtherDetailsSchema>({
    resolver: zodResolver(otherDetailsSchema),

    defaultValues: {
      pan: customer?.otherDetails?.pan || "",
      documents: customer?.otherDetails?.documents || [],
      websiteUrl: customer?.otherDetails?.websiteUrl || "",
      department: customer?.otherDetails?.department || "",
      designation: customer?.otherDetails?.designation || "",
      x: customer?.otherDetails?.x || "",
      facebook: customer?.otherDetails?.facebook || "",
    },
  });

  //  edit mutation other details  customer form handling >>>>>>>>>>>>>>>>>>>
  const {
    data: editODCustomerData,
    mutate: editODCustomer,
    isPending: isEditODCustomerPending,
    isSuccess: isEditODCustomerSuccess,
    error: editODCustomerError,
  } = useMutation({
    mutationFn: async (data: OtherDetailsSchema) => {
      // upload new files
      const uploadedDocuments = await Promise.all(
        (data.documents || []).map(async (doc: DocumentType) => {
          if (!(doc instanceof File)) {
            return doc;
          }

          // upload new file
          const uploaded = await uploadFile(doc);

          return {
            url: uploaded.url,
            key: uploaded.key,
            name: uploaded.originalName,
          };
        }),
      );

      // customer api
      const res = await axios.put(`/api/panel/customers/${customerId}`, {
        id: customerId,
        action: "otherDetails",
        ...data,
        documents: uploadedDocuments,
      });
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("customer update details successfully!");
    },

    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  // submit >>>>>>>>>>>>>>>>>>>>
  const onSubmit = (data: OtherDetailsSchema) => {
    editODCustomer(data);
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Message
            variant={editODCustomerError ? "destructive" : "default"}
            message={editODCustomerError?.message}
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* PAN */}
              <FormField
                control={form.control}
                name="pan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN</FormLabel>

                    <FormControl>
                      <Input placeholder="Enter PAN" {...field} />
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
                    <FormLabel>Documents</FormLabel>

                    <FormControl>
                      <div className="space-y-4">
                        {/* Upload */}
                        <FileUpload
                          value={(field.value || []).filter(
                            (item) => item instanceof File,
                          )}
                          onValueChange={(files) => {
                            // keep old uploaded files
                            const existing = (field.value || []).filter(
                              (item) => !(item instanceof File),
                            );

                            field.onChange([...existing, ...(files ?? [])]);
                          }}
                          accept="image/*,.pdf"
                          multiple
                          className="w-full"
                        >
                          <FileUploadDropzone className="border-2 border-dashed rounded-lg p-6 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <Upload className="w-10 h-10 text-muted-foreground" />

                              <div>
                                <p className="font-medium">
                                  Drag & Drop files here
                                </p>

                                <p className="text-sm text-muted-foreground">
                                  Upload image or PDF
                                </p>
                              </div>
                            </div>
                          </FileUploadDropzone>

                          <FileUploadList />
                        </FileUpload>

                        {/* Files List */}
                        <div className="space-y-3">
                          {(field.value || []).map(
                            (file: DocumentType, index) => {
                              const isUploaded = !(file instanceof File);

                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between border rounded-md p-3"
                                >
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-blue-500" />

                                    <div>
                                      {isUploaded ? (
                                        <a
                                          href={(file as UploadedDocument).url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-500 underline"
                                        >
                                          {(file as UploadedDocument).name ||
                                            "View File"}
                                        </a>
                                      ) : (
                                        <span>{(file as File).name}</span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Delete */}
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={async () => {
                                      try {
                                        // delete from cloudflare
                                        if (isUploaded) {
                                          await deleteFile(
                                            (file as UploadedDocument).key,
                                          );
                                        }

                                        const updated = [
                                          ...(field.value || []),
                                        ];

                                        updated.splice(index, 1);

                                        field.onChange(updated);

                                        toast.success("File removed");
                                      } catch (error) {
                                        toast.error("Delete failed");
                                      }
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website URL */}
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>

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

              {/* Department & Designation */}
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>

                      <FormControl>
                        <Input placeholder="Enter department" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>

                      <FormControl>
                        <Input placeholder="Enter designation" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Social */}
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="x"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>X</FormLabel>

                      <FormControl>
                        <Input placeholder="https://x.com/" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>

                      <FormControl>
                        <Input placeholder="https://facebook.com/" {...field} />
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
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Please wait
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default OtherDetailsForm;
