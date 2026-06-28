import { notFound } from "next/navigation";
import InvoiceClient from "@/components/website/pages/invoices/client";
interface props {
  params: { invoiceId: string };
}
const Page = async ({ params }: props) => {
  let { invoiceId } = await params;

  if (!invoiceId) {
    return notFound();
  }

  return <InvoiceClient invoiceId={invoiceId} />;
};

export default Page;
