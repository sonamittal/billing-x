import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CredentialsSignup from "@/components/auth/credentials-signup/credentials-signup";

export default async function SignUpPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("SESSION:", session);
  if (session?.user) {
    redirect("/auth/callback");
  }
  return <CredentialsSignup />;
}
