import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import OrganizationSetup from "@/components/website/pages/organization-setup/organization-setup";
import { redirect } from "next/navigation";
import { db } from "@/lib/database/db-connect";
import { eq } from "drizzle-orm";
import OrgAccessInvoiceBtn from "@/components/website/pages/organization-setup/org-access-invoice";
import checkOrgExsitence from "@/app/_server_actions/check-existence-org"

const Page = async() => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }
  const existingOrg = await checkOrgExsitence();
    if (existingOrg) {
    return <OrgAccessInvoiceBtn orgName={existingOrg.name} />;
  }

  return <OrganizationSetup />;
}
export default Page;