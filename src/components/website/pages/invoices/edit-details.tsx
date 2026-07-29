"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EditInvoices from "@/components/website/pages/invoices/edit";
import { invoiceWithRelations } from "@/app/api/panel/invoices/[invoiceId]/type";
import { useSearchParams } from "next/navigation";
import { PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "@/components/website/pages/invoices/pdf/invoice-pdf";
import type { Invoice as PdfInvoice } from "@/components/website/pages/invoices/pdf/type";
import { ToWords } from "to-words";
import EditInvoicePayment from "@/components/website/pages/invoices/edit-invoice-payment";

const toWords = new ToWords({
  localeCode: "en-IN",
});

interface Props {
  callback?: string;
  invoiceId: string;
  invoice: invoiceWithRelations;
}

// invoice tabs
const InvoiceEditDetails = ({ invoiceId, invoice, callback }: Props) => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "overview";

  const totalAmount = Number(invoice.totalAmount ?? 0);

  const amountPaid = (invoice.payments ?? []).reduce(
    (sum, payment) => sum + Number(payment.amountReceived ?? 0),
    0,
  );
  const balanceDue = totalAmount - amountPaid;

  //  amount in words

  const amountInWords =
    toWords.convert(Number(invoice.totalAmount), {
      currency: true,
      ignoreDecimal: true,
    }) + "";

  const pdfInvoice: PdfInvoice = {
    invoiceNo: invoice.invoiceNumber,
    invoiceDate: invoice.invoiceDate.toString(),
    dueDate: invoice.dueDate.toString(),
    status: invoice.status,

    customer: {
      name: invoice.customerName,
      address: {
        street1: invoice.customer?.street1 ?? "",
      },
      city: invoice.customer?.city ?? "",
      state: invoice.customer?.state ?? "",
      country: invoice.customer?.country ?? "",
      pinCode: invoice.customer?.pinCode ?? "",
      phone: invoice.customer?.mobile ?? invoice.customer?.workPhone ?? "",
      email: invoice.customer?.email ?? "",
    },

    items: invoice.items.map((item) => ({
      itemName: item.itemName,
      description: item.description,
      unit: item.unit,
      quantity: Number(item.quantity),
      rate: Number(item.rate),
      amount: Number(item.amount),
    })),

    subject: invoice.subject ?? "",

    subtotal: Number(invoice.subtotal),
    discount: Number(invoice.discount),
    totalAmount: Number(invoice.totalAmount),

    amountPaid,
    balanceDue,
    amountInWords,

    paymentStatus: invoice.paymentStatus,

    customerNotes: invoice.customerNotes,
    termsAndConditions: invoice.termsAndConditions,
  };
  return (
    <Tabs defaultValue={activeTab}>
      <div className="w-full overflow-x-auto pb-2">
        <TabsList className="flex  items-center gap-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoice-details">Invoice details</TabsTrigger>
          <TabsTrigger value="payment-details">Payment details</TabsTrigger>
        </TabsList>
      </div>

      {/* overview */}
      <TabsContent value="overview" className="mt-4">
        <PDFViewer className="w-full h-300">
          <InvoicePDF template="modern" invoice={pdfInvoice} />
        </PDFViewer>
      </TabsContent>

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

      <TabsContent value="payment-details" className="mt-4">
        {invoice.payments.length > 0 && (
          <EditInvoicePayment  invoiceId={invoiceId}
            invoice={invoice}
            callback = {callback}
           
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default InvoiceEditDetails;
