"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import { sinFormSchema } from "@/components/validation/validation";
import type { SigninFormSchema } from "@/components/validation/validation";
const CredentialsSignin = () => {
  const router = useRouter();
  // Getting callback url from query params >>>>>>>>>>>>>>>
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
  // form handling >>>>>>>>>>>>>
  const form = useForm<SigninFormSchema>({
    resolver: zodResolver(sinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { reset } = form;
  const onSubmit = (data: SigninFormSchema) => {
    console.log("Form Data Submitted:", data);
    reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ex@example.com" {...field} />
              </FormControl>
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CredentialsSignin;
