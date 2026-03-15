"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ui/image-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import Message from "@/components/ui/message";
import { Loader2 } from "lucide-react";
// role
import { USER_ROLES } from "@/lib/constants";
//Status
import { USER_STATUS } from "@/lib/constants";
import { Switch } from "@/components/ui/switch";
import { editUserFormSchema } from "@/components/validation/validation";
import type { EditUserFormSchema } from "@/components/validation/validation";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface userIdProps {
  user: any;
  callback?: string;
}

const EditUser = ({ user, callback }: userIdProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  // edit user form handling >>>>>>>>>>>>>>>>>
  const {
    mutate,
    isPending: isUpdateUserPending,
    isSuccess: isUpdateUserSuccess,
    error: updateUserError,
  } = useMutation({
    mutationFn: async (data: EditUserFormSchema) => {
      const response = await authClient.admin.updateUser({
        userId: user.id, // required
        data: {
          image: data.image,
          name: data.username,
          email: data.email,
          role: data.role,
          banned: data.banned === "true",
          emailVerified: data.isVerified,
        },
      });
      if (response.error) {
        throw new Error(response.error?.message || "failed to edit user ");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("user edit Successfully!!");
      form.reset();
      if (callback) {
        setTimeout(() => {
          router.push(callback);
        }, 1200);
      }
    },
  });
  // form handling >>>>>>>>>>>>>
  const form = useForm<EditUserFormSchema>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      image: user.image || "",
      username: user.name || "",
      email: user.email || "",
      role: user.role,
      banned: user.banned ? "true" : "false",
      isVerified: user.emailVerified || false,
    },
  });
  const onSubmit = (data: EditUserFormSchema) => {
    console.log("Form Data Submitted:", data);
    mutate(data);
  };
  return (
    <Card className="lg:col-span-2 h-fit">
      <CardHeader>
        <CardTitle>Edit user details</CardTitle>
        <CardDescription>
          Edit account details of{" "}
          <span className="text-foreground font-medium">{user.name}</span>{" "}
          account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Message
          variant={updateUserError ? "destructive" : "default"}
          message={updateUserError?.message}
        />
        <Form {...form}>
          <form
            id="user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">User image</FormLabel>
                  <FormDescription>
                    This image will be used for user avatar across the website.
                  </FormDescription>
                  <FormMessage />
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      maxUploadSize={5}
                      uploadApi={"/api/panel/upload"}
                      uploadAction={"uploadImage"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="eg:sonam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="eg: john.doe@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Status */}
            <FormField
              control={form.control}
              name="banned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {USER_STATUS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* verifying */}
            <FormField
              control={form.control}
              name="isVerified"
              render={({ field }) => (
                <FormItem className="rounded-md  flex flex-row items-center justify-between border p-4 space-y-0 gap-3">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Verify</FormLabel>
                    <FormDescription>
                      Verifying a user will allow the user to sign in.
                    </FormDescription>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              form="user-form"
              className="w-full"
              disabled={isUpdateUserPending}
            >
              {isUpdateUserPending ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                </>
              ) : (
                "Update details"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default EditUser;
