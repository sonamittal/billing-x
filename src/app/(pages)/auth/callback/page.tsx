import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import GetFirstOrg from "@/app/_server_actions/organization";

const CallbackPage =async() => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/auth/signin");
  }
 const existingOrg = await GetFirstOrg();
  if (existingOrg) {
    redirect("/"); 
  }

  redirect("/organization-setup");
}
export default CallbackPage;