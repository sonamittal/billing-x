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
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface userIdProps {
  user: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  callback?: string;
}

const DeleteUserDialog = ({ user, open, setOpen, callback }: userIdProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  // Delete user mutation >>>>>>>>>>>>>>>
  const { mutate: deleteUser, isPending: isDeleteUserPending } = useMutation({
    mutationFn: async () => {
      const res = await authClient.admin.removeUser({
        userId: user.id, // required
      });
      if (res.error) {
        throw new Error(res.error?.message || "Failed to delete user");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("user delete Successfully!!");
      if (callback) {
        setTimeout(() => {
          router.push(callback);
        }, 1200);
      }
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
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
             {(user.username ?? user.name ?? "Unknown") + "'s"}
            </span>{" "}
            account and it{"'"}s data from the server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="destructive"
            onClick={() => deleteUser()}
            disabled={isDeleteUserPending}
          >
            {isDeleteUserPending ? (
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
export default DeleteUserDialog;
