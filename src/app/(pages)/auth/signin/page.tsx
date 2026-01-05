import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SignInForm from "@/app/(pages)/auth/signin/signinform";

export default async function SignInPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("SESSION:", session);
  if (session?.user) {
    redirect("/");
  }
  return <SignInForm />;
}
