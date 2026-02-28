
import { notFound } from "next/navigation";
import UsersClient from "@/components/panel/pages/settings/users/client";
interface props{
    params:{userId : string}
}
const Page =  async ({ params }:props) => {
  let { userId } = await params;

  if (!userId) {
    return notFound();
  }

  return <UsersClient userId={userId} />;
};

export default Page;

