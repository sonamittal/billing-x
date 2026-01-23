import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignUpForm from "@/app/(pages)/auth/signup/signupform";

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("SESSION:", session);
  if (session?.user) {
    redirect("/organization/setup");
  }
  return <SignUpForm />;
}
