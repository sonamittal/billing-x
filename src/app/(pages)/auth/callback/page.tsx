import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import OrganizationSetup from "@/components/organization/organization-setup";
import { redirect } from "next/navigation";
import { db } from "@/lib/database/db-connect";
import { eq } from "drizzle-orm";
import OrgAccessInvoiceBtn from "@/components/organization/org-access-invoice"

export default async function OrganizationSetupPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin");
  }
  const existingOrg  = await db.query.organization.findFirst({
    where: (org)=>eq(org.userId, session.user.id),
  })
  if (existingOrg) {
     return <OrgAccessInvoiceBtn orgName={existingOrg.name} />
  }

  return <OrganizationSetup />;
}
