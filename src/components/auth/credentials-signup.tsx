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
import Message from "@/components/ui/message";
// import axios from "axios";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { supFormSchema } from "@/components/validation/validation";
import type { SignupFormSchema } from "@/components/validation/validation";
import { signUp } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
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
  // Sign up handling >>>>>>>>>>>>>>>
  const {
    mutate,
    isPending: isSignupPending,
    error: signupError,
  } = useMutation({
    mutationFn: async (data: SignupFormSchema) => {
      const response = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (response.error) {
        throw new Error(response.error?.message || "signup failed");
      }

      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("email", data.user.email);
      alert("Signup successful!");
      reset();
      router.push(
        `/auth/verify${callbackUrl ? `?callbackUrl=${callbackUrl}` : ""}`
      );
    },
  });
  const { reset } = form;
  const onSubmit = (data: SignupFormSchema) => {
    console.log("Form Data Submitted:", data);
    mutate(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Message
          variant={signupError ? "destructive" : "default"}
          message={signupError?.message}
          className="mt-3"
        />
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
        <Button type="submit" className="w-full" disabled={isSignupPending}>
          {isSignupPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              please wait
            </>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CredentialsSignup;
