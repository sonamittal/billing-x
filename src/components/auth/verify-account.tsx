"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@bprogress/next/app";
import Message from "@/components/ui/message";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { otpFormSchema } from "@/components/validation/validation";
import type { OtpFormSchema } from "@/components/validation/validation";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import ResendVerificationCode from "@/components/auth/resend-verification-code";

const VerifyAccount = () => {
  const router = useRouter();
  // Getting callback url from query params >>>>>>>>>>>>>>>
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
  const [email, setEmail] = useState<string | null>(null);

  // get email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      router.push(
        `/auth/signin${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`
      );
    } else {
      setEmail(storedEmail);
    }
  }, [router, callbackUrl]);

  // form handling >>>>>>>>>>>>>
  const form = useForm<OtpFormSchema>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      email: "",
      verificationCode: "",
    },
  });
  //set email in form
  useEffect(() => {
    if (email) {
      form.setValue("email", email);
    }
  }, [email, form]);
  //verify accont handling>>>>>>>>>>>>>>
  // check OTP verify
  const {
    mutate: verifyOtp,
    error: verifyError,
    isPending: isVerifyPending,
  } = useMutation({
    mutationFn: async (data: OtpFormSchema) => {
      const response = await authClient.signIn.emailOtp({
        email: data.email,
        otp: data.verificationCode,
      });
      if (response?.error) {
        throw new Error(response.error.message || "Verification failed");
      }
      return response?.data;
    },
    onSuccess: () => {
      setTimeout(() => {
        localStorage.removeItem("email");
        router.push(callbackUrl || "/");
      }, 3000);
    },
  });

  // submit
  const onSubmit = (data: OtpFormSchema) => {
    console.log("Form Data Submitted:", data);
    verifyOtp(data);
  };
  if (!email) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Message
          variant="destructive"
          message={verifyError?.message}
          className="mt-3"
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
        <Button type="submit" className="w-full" disabled={isVerifyPending}>
          {isVerifyPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </>
          ) : (
            "Verify Account"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default VerifyAccount;
