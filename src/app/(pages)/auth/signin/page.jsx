"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import CredentialsSignin from "@/components/auth/credentials-signin";
import Image from "next/image";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
const SignInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || null;
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
              <CardTitle>Sign in</CardTitle>
              <CardDescription>
                Sign in for an account and billing software.
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
          <CredentialsSignin />
          <p className="text-sm mt-5 ">
            Already have an account?{" "}
            <Link
              className="font-medium"
              href={`/auth/signup${
                callbackUrl ? `?callbackUrl=${callbackUrl}` : ""
              }`}
            >
              Signup
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
export default SignInForm;
