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
import Message from "@/components/ui/message";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { otpFormSchema } from "@/components/validation/validation";
import type { OtpFormSchema } from "@/components/validation/validation";

const VerifyAccount = () => {
  // form handling >>>>>>>>>>>>>
  const form = useForm<OtpFormSchema>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      email: "",
      verificationCode: "",
    },
  });
  const onSubmit = (data: OtpFormSchema) => {
    console.log("Form Data Submitted:", data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Message className="mt-3" />
        <FormField
          control={form.control}
          name="verificationCode"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <FormLabel className="mt-5">Verification Code</FormLabel>
                <FormLabel className="text-primary cursor-pointer hover:underline">
                  Resend Code
                </FormLabel>
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
        <Button type="submit" className="w-full">
          Verify Account
        </Button>
      </form>
    </Form>
  );
};
export default VerifyAccount;
