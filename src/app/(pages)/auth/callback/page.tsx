import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import checkOrgExsitence from "@/app/_server_actions/check-existence-org"

const CallbackPage =async() => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/auth/signin");
  }
  const existingOrg = await checkOrgExsitence();
  if (existingOrg) {
    redirect("/"); 
  }

  redirect("/organization-setup");
}
export default CallbackPage;