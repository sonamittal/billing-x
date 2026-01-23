import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import OrganizationSetup from "@/components/organization/organization-setup";
import { redirect } from "next/navigation";
import { db } from "@/lib/database/db-connect";
import { organization } from "@/drizzle/schema/schema";
import { eq } from "drizzle-orm";

export default async function OrganizationSetupPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }
  const existingOrg  = await db.query.organization.findFirst({
    where: (org)=>eq(org.userId, session.user.id),
  })
  if (existingOrg) {
    redirect("/");
  }

  return <OrganizationSetup />;
}
