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

interface AddNewUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const AddNewUserForm = ({ open, onOpenChange }: AddNewUserFormProps) => {
  // add new user form handling >>>>>>>>>>>>>>>>>
  const {
    mutate,
    isPending: userPending,
    isError: userError,
  } = useMutation({
    mutationFn: async (data: AddNewUserFormSchema) => {
      const res = await authClient.admin.createUser({
        name: data.username,
        email: data.email,
        role: data.role as any,
        password: data.password,
        data: { customField: "customValue" },
      });
      if (res.error) {
        throw new Error(res.error?.message || "Failed to create user");
      }
      return res.data;
    },
    onSuccess: async () => {
      alert("create new user Successfully!! ");
      form.reset();
      onOpenChange(false);
    },
  });

  // form handling >>>>>>>>>>>>>>>
  const form = useForm<AddNewUserFormSchema>({
    resolver: zodResolver(addNewUserFormSchema),
    defaultValues: {
      username: "",
      email: "",
      role: undefined,
      password: "",
      confirmPassword: "",
    },
  });
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Add New User
          </DialogTitle>
          <DialogDescription>
            Create new user here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
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
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="·········" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-y-2">
          <Button type="submit" form="user-form" disabled={userPending}>
            {userPending ? (
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
