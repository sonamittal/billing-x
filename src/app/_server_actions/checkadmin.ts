import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const canCreateUser = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return false;

  const res = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: { user: ["create"] },
    },
  });

  // res.success will be true if the user has permission
  return res.success;
};

