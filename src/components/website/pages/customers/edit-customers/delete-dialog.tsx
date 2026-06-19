import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

 interface DeleteCustomer {
  id: string;
  user: {
    name: string;
  };
}
interface CustomerIdProps {
  customer: DeleteCustomer;
  open: boolean;
  setOpen: (open: boolean) => void;
  callback?: string;
}

const DeleteCustomerDialog = ({
  customer,
  open,
  setOpen,
  callback,
}: CustomerIdProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  // Delete cstomer mutation >>>>>>>>>>>>>>>
  const { mutate: deleteCustomer, isPending: isDeleteCustomerPending } =
    useMutation({
      mutationFn: async () => {
        const res = await axios.delete(`/api/panel/customers/${customer.id}`);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["customers"],
        });
        toast.success(" Customer deleted Successfully!!");
        if (callback) {
          setTimeout(() => {
            router.push(callback);
          }, 1200);
        }
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "failed to delete Customer");
      },
    });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-[95%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-medium text-foreground">
              {(customer.user?.name ?? "Unknown") + "'s"}
            </span>{" "}
            account and it{"'"}s data from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="destructive"
            onClick={() => deleteCustomer()}
            disabled={isDeleteCustomerPending}
          >
            {isDeleteCustomerPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                wait{" "}
              </>
            ) : (
              "Delete account"
            )}
          </Button>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteCustomerDialog;
