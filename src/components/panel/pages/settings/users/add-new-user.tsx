"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, UserCheck, Users, CreditCard, Loader2 } from "lucide-react";
import { addNewUserFormSchema } from "@/components/validation/validation";
import type { AddNewUserFormSchema } from "@/components/validation/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
// role
import { USER_ROLES } from "@/lib/constants";
//Status
import { USER_STATUS } from "@/lib/constants";
import { Switch } from "@/components/ui/switch";
import Message from "@/components/ui/message";
import ImageUpload from "@/components/ui/image-upload";

interface AddNewUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const AddNewUserForm = ({ open, onOpenChange }: AddNewUserFormProps) => {
  // add new user form handling >>>>>>>>>>>>>>>>>
  const {
    data: addUserData,
    mutate,
    isPending: isAddUserPending,
    isSuccess: isAddUserSuccess,
    error: addUserError,
  } = useMutation({
    mutationFn: async (data: AddNewUserFormSchema) => {
      const res = await authClient.admin.createUser({
        name: data.username,
        email: data.email,
        role: data.role as any,
        password: data.password,
        data: {
          customField: "customValue",
          image: data.image,
          isVerified: data.isVerified,
          isStatus: data.status,
        },
      });
      if (res.error) {
        throw new Error(res.error?.message || "Failed to create user");
      }
      return res.data;
    },
    onSuccess: async () => {
      alert("new user create Successfully!! ");
      form.reset();
      onOpenChange(false);
    },
  });

  // form handling >>>>>>>>>>>>>>>
  const form = useForm({
    resolver: zodResolver(addNewUserFormSchema),
    defaultValues: {
      image: "",
      username: "",
      email: "",
      role: undefined,
      status: undefined,
      password: "",
      isVerified: false,
    },
  });
  // Submit
  const onSubmit = (data: AddNewUserFormSchema) => {
    console.log("Form Data Submitted:", data);
    mutate(data);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className="overflow-auto w-[60%] md:max-w-[85%] xl:max-w-[70%] max-h-[90vh]">
        <DialogHeader className="text-start">
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Add New User
          </DialogTitle>
          <DialogDescription>
            Create new user here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Message
          variant={addUserError ? "destructive" : "default"}
          message={
            addUserError?.message ||
            (isAddUserSuccess && addUserData
              ? "user create Successfully!!"
              : "")
          }
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
              name="status" // corrected from role
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
            {/* password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="·········" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* verifying */}
            <FormField
              control={form.control}
              name="isVerified"
              render={({ field }) => (
                <FormItem className="rounded-md bg-background flex flex-row items-center justify-between border p-4 space-y-0 gap-3">
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
          </form>
        </Form>
        <DialogFooter className="gap-y-2">
          <Button type="submit" form="user-form" disabled={isAddUserPending}>
            {isAddUserPending ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default AddNewUserForm;
