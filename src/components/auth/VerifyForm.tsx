"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { MoveLeft } from "lucide-react";
import VerifyAccount from "@/components/auth/verify-account";
import { useSearchParams } from "next/navigation";
const VerifyForm = () => {
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
              <CardTitle>Verify your account</CardTitle>
              <CardDescription>
                An verification code has been sent on your email
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
          <VerifyAccount />
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
export default VerifyForm;
