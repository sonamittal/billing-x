import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CredentialsSignin from "@/components/auth/credentials-signin/credentials-signin";

export default async function SignInPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("SESSION:", session);
  if (session?.user) {
   redirect("/auth/callback");
  }
  return <CredentialsSignin />;
}
