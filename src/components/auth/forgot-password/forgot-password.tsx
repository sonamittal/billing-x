"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Message from "@/components/ui/message";
import { useSearchParams } from "next/navigation";
import { otpFormSchema } from "@/components/validation/validation";
import type { OtpFormSchema } from "@/components/validation/validation";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import SetPassword from "@/components/auth/forgot-password/set-password";

const ForgotPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
  //form handling
  const form = useForm({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      email: "",
    },
  });
  // send Verification code >>>>>>>>>>>>
  const [emailReceived, setEmailReceived] = useState<string | null>(null);
  const {
    mutate: sendVerificationCode,
    isPending: isSendVerificationCodePending,
    error: sendVerificationCodeError,
  } = useMutation({
    mutationFn: async (data: OtpFormSchema) => {
      const res = await authClient.forgetPassword.emailOtp({
        email: data.email,
      });
      if (res.error) {
        throw new Error(res.error?.message);
      }
      return res.data;
    },
    onSuccess: (_data ,variables) => {
      alert("Verification code sent on your email.");
      reset();
      setEmailReceived(variables.email);
    },
  });
  // submit
  const { reset } = form;
  const onSubmit = (data: OtpFormSchema) => {
    console.log("form data submitted:", data);
    sendVerificationCode(data);
  };
  if (emailReceived) {
    return <SetPassword email = {emailReceived}  />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {sendVerificationCodeError && (
          <Message
            variant="destructive"
            message={sendVerificationCodeError?.message}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johndoe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isSendVerificationCodePending}
        >
          {isSendVerificationCodePending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
            </>
          ) : (
            "Send verification code"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPassword;
