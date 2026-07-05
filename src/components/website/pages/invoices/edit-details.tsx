"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EditInvoices from "@/components/website/pages/invoices/edit";
import { invoiceWithRelations } from "@/app/api/panel/invoices/[invoiceId]/type";
import { useSearchParams } from "next/navigation";

interface Props {
  callback?: string;
  invoiceId: string;
  invoice: invoiceWithRelations;
}

// invoice tabs
const InvoiceEditDetails = ({ invoiceId, invoice, callback }: Props) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "invoice-details";
  return (
    <Tabs defaultValue={activeTab}>
      <div className="w-full overflow-x-auto pb-2">
        <TabsList className="flex  items-center gap-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoice-details">Invoice details</TabsTrigger>
        </TabsList>
      </div>

      {/* invoice detials*/}
      <TabsContent value="invoice-details" className="mt-4">
        <div className="space-y-4">
          <EditInvoices
            invoiceId={invoiceId}
            invoice={invoice}
            callback={callback}
          />
        </div>
      </TabsContent>

      {/* overview */}
      <TabsContent value="overview" className="mt-4">
        <div className="space-y-4">
          {/* <ContactPersonTable
                callback={callback}
                customerId={customer?.id}
              /> */}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default InvoiceEditDetails;
