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
import { UserPlus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { userFormSchema } from "@/components/validation/validation";
import type { UserFormSchema } from "@/components/validation/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Message from "@/components/ui/message";
import ImageUpload from "@/components/ui/image-upload";
import { toast } from "sonner";
import axios from "axios";

type Props = {
  onBack?: () => void;
  onNext?: () => void;
};

const CAddUserForm = ({ onBack, onNext }: Props) => {
  const queryClient = useQueryClient();

  // form handling >>>>>>>>>>>>>>>
  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      image: "",
      username: "",
      email: "",
      phoneno: "",
      password: "",
    },
  });

  // add new user form handling >>>>>>>>>>>>>>>>>
  const {
    data: addUserData,
    mutate: addUser,
    isPending: isAddUserPending,
    isSuccess: isAddUserSuccess,
    error: addUserError,
  } = useMutation({
    mutationFn: async (data: UserFormSchema) => {
      const res = await axios.post(`/api/`, data);
      if (res.data.error) {
        throw new Error(res.data.error?.message || "Failed to create user");
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("User created successfully!");
      form.reset();
    },
  });
  const onSubmit = (data: UserFormSchema) => {
    console.log("Form Data Submitted:", data);
    addUser(data);
    onNext?.();
  };

  return (
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
          addUserError?.message || (isAddUserSuccess && addUserData.message)
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
                <FormLabel className="text-base">
                  User image <span className="text-red-500">*</span>
                </FormLabel>
                <FormDescription>
                  This image will be used for user avatar across the website.
                </FormDescription>
                <FormMessage />
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    maxUploadSize={5}
                    uploadApi={"/api/panel/images/upload"}
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
                <FormLabel>
                  Username <span className="text-red-500">*</span>
                </FormLabel>
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
                <FormLabel>
                  Email <span className="text-red-500">*</span>
                </FormLabel>
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
          {/* phone no */}
          <FormField
            control={form.control}
            name="phoneno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone Number <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="eg: +1234567890" {...field} />
                </FormControl>
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
        </form>
      </Form>
      <DialogFooter className="gap-y-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 w-full">
          {onBack && (
            <Button className="gap-1" variant="outline" onClick={onBack}>
              <ChevronLeft className="mt-0.5" /> Back
            </Button>
          )}
          <div className="flex justify-between gap-3 mt-3">   
            <Button type="submit" form="user-form" disabled={isAddUserPending}>
              {isAddUserPending ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                </>
              ) : (
                "Add user "
              )}
            </Button>
            {onNext && (
              <Button className="gap-1" variant="outline" onClick={onNext}>
                Next
                <ChevronRight className="mt-0.5" />
              </Button>
            )}
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};
export default CAddUserForm;
