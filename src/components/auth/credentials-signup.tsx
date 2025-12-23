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
import { supFormSchema } from "@/components/validation/validation";
import type { SignupFormSchema } from "@/components/validation/validation";
const CredentialsSignup = () => {
  const router = useRouter();
  // Getting callback url from query params >>>>>>>>>>>>>>>
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
  // form handling >>>>>>>>>>>>>
  const form = useForm<SignupFormSchema>({
    resolver: zodResolver(supFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { reset } = form;
  const onSubmit = (data: SignupFormSchema) => {
    console.log("Form Data Submitted:", data);
    reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Riya dubey" {...field} />
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
                <Input type="email" placeholder="ex@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className=" grid grid-cols-1 sm:grid-cols-2 gap-2">
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
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CredentialsSignup;
