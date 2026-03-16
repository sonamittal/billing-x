import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Loader2, KeyRound } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import Message from "@/components/ui/message";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserPasswordFormSchema } from "@/components/validation/validation";
import type { UpdateUserPasswordFormSchema } from "@/components/validation/validation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
interface userIdProps {
  user: any;
}
const UpdateUserPassword = ({ user }: userIdProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  // form handling >>>>>>>>>>>>>
  const form = useForm<UpdateUserPasswordFormSchema>({
    resolver: zodResolver(updateUserPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  // update user form handling >>>>>>>>>>>>>>>>>
  const {
    mutate,
    isPending: isUpdateUserPending,
    isSuccess: isUpdateUserSuccess,
    error: updateUserError,
  } = useMutation({
    mutationFn: async (data: UpdateUserPasswordFormSchema) => {
      const res = await authClient.admin.setUserPassword({
        newPassword: data.password, // required
        userId: user.id, // required
      });
      if (res.error) {
        throw new Error(res.error?.message || "failed to user password ");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
      form.reset();
      setTimeout(() => {
        router.push("/panel/users");
      }, 1200);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
  const onSubmit = (data: UpdateUserPasswordFormSchema) => {
    console.log("Form Data Submitted:", data);
    mutate(data);
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <KeyRound strokeWidth={1} />
        </div>
        <CardTitle className="text-lg">Reset account password</CardTitle>
        <CardDescription>
          This will reset the password of{" "}
          <span className="text-foreground font-medium">
            {user.name + "'s"}
          </span>{" "}
          account.
        </CardDescription>
        <Message
          variant={updateUserError ? "destructive" : "default"}
          message={updateUserError?.message}
          className="mb-4"
        />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="·········" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {" "}
                    Confirm Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="·········" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isUpdateUserPending}
            >
              {isUpdateUserPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  please wait
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default UpdateUserPassword;
