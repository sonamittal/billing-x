"use client";
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
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteContactPersonDialogProps {
  contact: any;
  customerId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  callback?: string;
}

const DeleteContactPersonDialog = ({
  contact,
  customerId,
  open,
  setOpen,
  callback,
}: DeleteContactPersonDialogProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deleteContact, isPending: isDeletePending } = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(
        `/api/panel/customers/${customerId}/contact-person/${contact.id}`,
      );

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contact-persons", customerId],
      });

      toast.success("Contact person deleted successfully");
      setOpen(false);
      if (callback) {
        setTimeout(() => {
          router.push(callback);
        }, 1200);
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete contact person",
      );
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            <span className="font-medium text-foreground">
              {" "}
              {contact?.firstName} {contact?.lastName}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button
            variant="destructive"
            onClick={() => deleteContact()}
            disabled={isDeletePending}
          >
            {isDeletePending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Delete Contact"
            )}
          </Button>

          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteContactPersonDialog;
