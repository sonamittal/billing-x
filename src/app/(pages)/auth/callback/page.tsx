import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import OrganizationSetup from "@/components/organization/organization-setup";
import { redirect } from "next/navigation";

export default async function OrganizationSetupPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

    // if (session.user.organizationId) {
    //   redirect("/");
    // }

  return <OrganizationSetup />;
}
