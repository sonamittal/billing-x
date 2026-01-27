import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/database/db-connect";

const CallbackPage =async() => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/auth/signin");
  }
  const existingOrg = await db.query.organization.findFirst({
    where: (org, { eq }) => eq(org.id, session.user.id),
  });
  if (existingOrg) {
    redirect("/"); 
  }

  redirect("/organization-setup");
}
export default CallbackPage;