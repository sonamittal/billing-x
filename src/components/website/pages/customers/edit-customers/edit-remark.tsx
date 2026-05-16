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

import {
  otherDetailsSchema,
  type OtherDetailsSchema,
} from "@/components/validation/validation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Message from "@/components/ui/message";

const EditRemark = () => {
  // form handling
  const form = useForm<OtherDetailsSchema>({
    resolver: zodResolver(otherDetailsSchema),
    defaultValues: {
      remarks: "",
    },
  });
  // edit remark >>>>>>>>>>>>>>>
  const {
    data: editCustomerData,
    mutate: editCustomer,
    isPending: isEditCustomerPending,
    isSuccess: isEditCustomerSuccess,
    error: editCustomerError,
  } = useMutation({
    mutationFn: async (data: OtherDetailsSchema) => {
      const res = await axios.post("", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Remarks updated successfully");
      form.reset();
    },
    onError: (error) => {
      console.log("Error:", error);
    },
  });
  const onSubmit = (data: OtherDetailsSchema) => {
    console.log("Form Data Submitted:", data);
    editCustomer(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Message
          variant={editCustomerError ? "destructive" : "default"}
          message={
            editCustomerError?.message ||
            (isEditCustomerSuccess && editCustomerData.message)
          }
        />
        {/* Remark */}
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your remarks..."
                  className="min-h-30"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
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
            "Update details"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditRemark;
