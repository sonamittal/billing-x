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
import { forgotPasswordFormSchema } from "@/components/validation/validation";
import type { ForgotPasswordFormSchema } from "@/components/validation/validation";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2, MoveLeft } from "lucide-react";
import React, { useState } from "react";
import SetPassword from "@/components/auth/forgot-password/set-password";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SetPasswordForm from "@/components/auth/forgot-password/set-password";
const ForgotPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
  //form handling
  const form = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordFormSchema),
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
    mutationFn: async (data: ForgotPasswordFormSchema) => {
      const res = await authClient.forgetPassword.emailOtp({
        email: data.email,
      });
      if (res.error) {
        throw new Error(res.error.message);
      }
      return res.data;
    },
    onSuccess: (_data, variables) => {
      alert("Verification code sent on your email.");
      reset();
      setEmailReceived(variables.email);
    },
  });
  // submit
  const { reset } = form;
  const onSubmit = (data: ForgotPasswordFormSchema) => {
    console.log("form data submitted:", data);
    sendVerificationCode(data);
  };
  if (emailReceived) {
    return <SetPasswordForm email={emailReceived} />;
  }

  return (
    <div className="container flex items-center justify-center  w-full h-screen">
      <Card className="w-full md:w-[50%] mx-auto max-h-[90vh] overflow-auto">
        <CardHeader>
          <Link
            href="/"
            className="flex gap-2 items-center mb-5  font-medium text-sm text-primary "
          >
            <MoveLeft className="w-5 h-5" /> Go back to website
          </Link>
          <div className="flex flex-col-reverse lg:flex-row gap-5 lg:gap-10 items-center justify-between">
            <div className="space-y-2 text-center lg:text-left">
              <CardTitle>Forgot password</CardTitle>
              <CardDescription>
                Enter your email to change your password
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              {sendVerificationCodeError && (
                <Message
                  variant="destructive"
                  message={sendVerificationCodeError.message}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="johndoe@example.com"
                        {...field}
                      />
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait{" "}
                  </>
                ) : (
                  "Send verification code"
                )}
              </Button>
            </form>
          </Form>
          <p className="text-sm mt-5 ">
            Already have an account?{" "}
            <Link
              className="font-medium"
              href={`/auth/signin${
                callbackUrl ? `?callbackUrl=${callbackUrl}` : ""
              }`}
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
