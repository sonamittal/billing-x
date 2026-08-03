"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  paymentTermSchema,
  type PaymentTermSchema,
} from "@/components/validation/validation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PTR {
  id: string;
  termName: string;
  dueAfter: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPaymentTerm: (data: PTR) => void;
  customerId: string;
}

const AddNewPayTForm = ({
  open,
  onOpenChange,
  onAddPaymentTerm,
  customerId,
}: Props) => {
  // form handling >>>>>>>>>>>>>>>
  const form = useForm<PaymentTermSchema>({
    resolver: zodResolver(paymentTermSchema),
    defaultValues: {
      termName: "",
      dueAfter: 1,
    },
  });

  // add payment form handling >>>>>>>>>>>>>>
  const {
    data: addCPTData,
    mutate: addCPaymentTerm,
    isPending: isAddCPaymentTermPending,
    isSuccess: isAddCPaymentTermSuccess,
    error: addCPTError,
  } = useMutation({
    mutationFn: async (data: PaymentTermSchema) => {
      try {
        const res = await axios.post(
          `/api/panel/customers/${customerId}/payment-terms`,
          data,
        );
        return res.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Failed to add new payment terms",
        );
      }
    },

    onSuccess: (data) => {
      onAddPaymentTerm(data);
      toast.success(" New Payment term  has been added successfully!");
      form.reset();
      onOpenChange(false);
    },
  });

  //onSubmit
  const onSubmit = (data: PaymentTermSchema) => {
    console.log("Form Data Submitted:", data);
    addCPaymentTerm(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-auto w-[60%] md:max-w-[85%] xl:max-w-[70%] max-h-[90vh]">
        <DialogHeader className="text-start">
          <DialogTitle className="flex items-center gap-2">
            New Payment Term
          </DialogTitle>
          <DialogDescription>
            Create and manage custom payment terms for customer billing and
            invoices.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Term Name */}
            <FormField
              control={form.control}
              name="termName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Term Name <span className="text-red-500">*</span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter term name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Due After */}
            <FormField
              control={form.control}
              name="dueAfter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Due After (Days)<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter days"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 0 : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit */}
            <div className="flex justify-start gap-3">
              <Button
                type="submit"
                className="px-5 py-2"
                disabled={isAddCPaymentTermPending}
              >
                {isAddCPaymentTermPending ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Please wait
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default AddNewPayTForm;
