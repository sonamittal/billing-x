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
import { Loader2, MoveLeft } from "lucide-react";
import { setPasswordFormSchema } from "@/components/validation/validation";
import type { SetPasswordFormSchema } from "@/components/validation/validation";
import { authClient } from "@/lib/auth-client";
import ResendVerificationCode from "@/components/auth/resend-verification-code";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface SetPasswordProps {
  email: string;
}
const SetPassword = ({ email }: SetPasswordProps) => {
  const router = useRouter();
  // Getting callback url from query params >>>>>>>>>>>>>>>
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
  //Email missing
  useEffect(() => {
    if (!email) {
      console.error("Email missing");
      router.push("/auth/forgot-password");
    }
  }, [email, router]);
  //form handling
  const form = useForm<SetPasswordFormSchema>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      verificationCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  // set password
  const {
    mutate: setPassword,
    error: isSetPasswordError,
    isPending: isSetPasswordPending,
    isSuccess: isSetPasswordSuccess,
  } = useMutation({
    mutationFn: async (data: SetPasswordFormSchema) => {
      const Verifyres = await authClient.emailOtp.checkVerificationOtp({
        email,
        type: "forget-password",
        otp: data.verificationCode,
      });
      if (Verifyres.error) {
        throw new Error(Verifyres.error.message);
      }

      //  Reset password
      const resetRes = await authClient.emailOtp.resetPassword({
        email,
        otp: data.verificationCode,
        password: data.password,
      });
      if (resetRes.error) {
        throw new Error(resetRes.error.message);
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
  const onSubmit = (data: SetPasswordFormSchema) => {
    console.log("form data submitted:", data);
    setPassword(data);
  };
  return (
    <div className="container flex justify-center items-center w-full h-screen">
      <Card className="w-full md:w-[90%] mx-auto border max-h-[90vh] overflow-auto">
        <CardHeader>
          <Link
            href="/"
            passHref
            className="flex items-center gap-3 mb-5 text-sm font-medium text-primary"
          >
            <MoveLeft className="w-5 h-5" /> Go back to website
          </Link>
          <div className="flex flex-col-reverse lg:flex-row gap-5 lg:gap-10 lg:items-start items-center justify-center text-center lg:text-left lg:justify-between">
            <div className="space-y-2">
              <CardTitle>Set new password</CardTitle>
              <CardDescription>
                An verification code has been sent on your email{" "}
                <span className="text-foreground">{email}</span>.
              </CardDescription>
            </div>
            <Image
              className="invert brightness-0"
              src="/next.svg"
              alt="logo"
              width={150}
              height={100}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Message
                className="mt-3"
                variant={isSetPasswordError ? "destructive" : "default"}
                message={
                  isSetPasswordError
                    ? isSetPasswordError.message
                    : isSetPasswordSuccess
                    ? "Your password has been successfully changed. Redirecting to sign in page."
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
                        <Input
                          type="password"
                          placeholder="·········"
                          {...field}
                        />
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
                        <Input
                          type="password"
                          placeholder="·········"
                          {...field}
                        />
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
        </CardContent>
      </Card>
    </div>
  );
};
export default SetPassword;
