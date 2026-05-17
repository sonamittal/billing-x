import { notFound } from "next/navigation";
import CustomersClient from "@/components/website/pages/customers/client";
interface props {
  params: { customerId: string };
}
const Page = async ({ params }: props) => {
  let {customerId } = await params;

  if (!customerId) {
    return notFound();
  }

  return <CustomersClient customerId={customerId} />;
};

export default Page;
