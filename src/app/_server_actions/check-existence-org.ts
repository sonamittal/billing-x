import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/database/db-connect";

const checkOrgExsitence = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return null;
  }
  const existingOrg = await db.query.organization.findFirst({
    where: (org, { eq }) => eq(org.id, session.user.id),
  });
  return existingOrg;
};
export default checkOrgExsitence;
