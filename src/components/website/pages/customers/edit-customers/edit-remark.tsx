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
  editCRSchema,
  type EditCRSchema,
} from "@/components/validation/validation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Message from "@/components/ui/message";
import { useRouter } from "next/navigation";

interface Props {
  customerId: string;
  callback?: string;
  customer: any;
}
const EditRemark = ({ callback, customer, customerId }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // form handling
  const form = useForm<EditCRSchema>({
    resolver: zodResolver(editCRSchema),
    defaultValues: {
      remarks: customer?.otherDetails?.remarks || "",
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
    mutationFn: async (data: EditCRSchema) => {
      const res = await axios.put(`/api/panel/customers/${customerId}`, {
        action: "remarks",
        ...data,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Remarks updated successfully");
      if (callback) {
        setTimeout(() => {
          router.push(callback);
        }, 1200);
      }
    },
    onError: (error) => {
      console.log("Error:", error);
    },
  });
  const onSubmit = (data: EditCRSchema) => {
    console.log("Form Data Submitted:", data);
    editCustomer(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Message
          variant={editCustomerError ? "destructive" : "default"}
          message={editCustomerError?.message}
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
