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
// import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import { sinFormSchema } from "@/components/validation/validation";
import type { SigninFormSchema } from "@/components/validation/validation";
import { signIn } from "@/lib/auth-client";
import Message from "@/components/ui/message";
import { Loader2 } from "lucide-react";
import Link from "next/link";
const CredentialsSignin = () => {
  const router = useRouter();
  // Getting callback url from query params >>>>>>>>>>>>>>>
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
  //sign in handling>>>>>>>>>>>>>>
  const {
    mutate,
    isPending: signinPending,
    error: signinError,
  } = useMutation({
    mutationFn: async (data: SigninFormSchema) => {
      const response = await signIn.email({
        email: data.email,
        password: data.password,
      });
      if (response.error) {
        throw new Error(response.error?.message || "signin failed");
      }

      return response.data;
    },
    onSuccess: () => {
      alert("Signin Successful!");
      reset();
      router.push(callbackUrl || "/");
    },
  });
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
    mutate(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Message
          variant={signinError ? "destructive" : "default"}
          message={signinError?.message}
          className="mt-3"
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
              <Link
                href="/auth/forgot-password"
                className="mt-5 text-sm text-right hover:underline"
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={signinPending}>
          {signinPending ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Please wait
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CredentialsSignin;
