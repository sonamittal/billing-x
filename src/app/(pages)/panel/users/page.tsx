import { notFound } from "next/navigation";
import { checkUser } from "@/app/_server_actions/checkadmin";
import Users from "@/app/(pages)/panel/users/users";

export default async function Page() {
  const hasAccess = await checkUser();

  if (!hasAccess) {
    return notFound();
  }

  return <Users />;
}