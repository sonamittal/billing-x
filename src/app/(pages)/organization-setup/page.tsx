import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import OrganizationSetup from "@/components/website/pages/organization-setup/organization-setup";
import { redirect } from "next/navigation";
import OrgAccessInvoiceBtn from "@/components/website/pages/organization-setup/org-access-invoice";
import GetFirstOrg from "@/app/_server_actions/organization";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }
  const existingOrg = await GetFirstOrg();
  if (existingOrg) {
    return <OrgAccessInvoiceBtn orgName={existingOrg.name} />;
  }

  return <OrganizationSetup />;
};
export default Page;
