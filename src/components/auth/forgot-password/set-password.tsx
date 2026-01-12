"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { forgotPasswordFormSchema } from "@/components/validation/validation";
import type { ForgotPasswordFormSchema } from "@/components/validation/validation";
import { authClient } from "@/lib/auth-client";
import ResendVerificationCode from "@/components/auth/resend-verification-code";
import React, { useEffect, useState } from "react";
interface SetPasswordProps {
  email: string;
}
const SetPassword = ({ email }: SetPasswordProps) => {
  const router = useRouter();
  // Getting callback url from query params >>>>>>>>>>>>>>>
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
  //form handling
  const form = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
      verificationCode: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { setValue } = form;
  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);
  // set password
  const {
    mutate: setPassword,
    error: isSetPasswordError,
    isPending: isSetPasswordPending,
    isSuccess: isSetPasswordSuccess,
  } = useMutation({
    mutationFn: async (data: ForgotPasswordFormSchema) => {
      const Verifyres = await authClient.emailOtp.checkVerificationOtp({
        email: data.email,
        type: "forget-password",
        otp: data.verificationCode,
      });
      if (Verifyres.error) {
        throw new Error(Verifyres.error?.message);
      }

      //  Reset password
      const resetRes = await authClient.emailOtp.resetPassword({
        email: data.email,
        otp: data.verificationCode,
        password: data.password,
      });
      if (resetRes.error) {
        throw new Error(resetRes.error?.message);
      }
      return resetRes?.data;
    },
    onSuccess: async () => {
      alert("set password Successful");
      reset();
      router.push(
        `/auth/signin${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`
      );
    },
  });

  // submit
  const { reset } = form;
  const onSubmit = (data: ForgotPasswordFormSchema) => {
    console.log("form data submitted:", data);
    setPassword(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Message
          className="mt-3"
          variant={isSetPasswordError ? "destructive" : "default"}
          message={
            isSetPasswordError
              ? isSetPasswordError.message
              : isSetPasswordSuccess
              ? isSetPasswordSuccess &&
                "Your password has been successfully changed. Redirecting to sign in page."
              : ""
          }
        />
        <FormField
          control={form.control}
          name="verificationCode"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <FormLabel className="mt-5">Verification Code</FormLabel>
                <ResendVerificationCode email={email} />
              </div>
              <FormControl>
                <InputOTP
                  className="overflow-hidden max-w-full"
                  maxLength={6}
                  {...field}
                >
                  <InputOTPGroup className="mt-2">
                    <InputOTPSlot index={0} className="w-18 h-9" />
                    <InputOTPSlot index={1} className="w-18 h-9" />
                    <InputOTPSlot index={2} className="w-18 h-9" />
                    <InputOTPSlot index={3} className="w-18 h-9" />
                    <InputOTPSlot index={4} className="w-18 h-9" />
                    <InputOTPSlot index={5} className="w-18 h-9" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-2 grid-cols-1 xs:grid-cols-2 w-full">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
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
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="·········" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isSetPasswordPending}
        >
          {isSetPasswordPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Please wait
            </>
          ) : (
            "Set password"
          )}
        </Button>
      </form>
    </Form>
  );
};
export default SetPassword;
