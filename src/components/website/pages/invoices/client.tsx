"use client";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Message from "@/components/ui/message";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { invoiceWithRelations } from "@/app/api/panel/invoices/[invoiceId]/type";
import EditInvoices from "@/components/website/pages/invoices/edit";
import { ApiErrorResponse } from "@/http/type";

interface props {
  invoiceId: string;
}

const InvoiceClient = ({ invoiceId }: props) => {
  // Fetch users
  const { data, error, isPending, isSuccess } = useQuery<
    invoiceWithRelations,
    Error
  >({
    queryKey: ["invoices", invoiceId],
    queryFn: async () => {
      try {
        const res = await axios.get<{
          success: true;
          data: invoiceWithRelations;
        }>(`/api/panel/invoices/${invoiceId}`);

        return res.data.data;
      } catch (error) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
          throw new Error(
            error.response?.data?.message ?? "Failed to fetch invoice",
          );
        }
        throw new Error("Failed to fetch invoice");
      }
    },
    retry: false,
    enabled: !!invoiceId,
  });
  console.log(data);

  if (!invoiceId) {
    return notFound();
  }

  return (
    <div className="mx-4 my-2">
      <Message
        variant={error ? "destructive" : "default"}
        message={error?.message}
        className="mt-3"
      />
      {!error && data && (
        <Breadcrumb className="mb-5 flex items-center gap-0.5">
          <BreadcrumbItem>
            <a className="font-light" href="/panel/invoices">
              Invoices
            </a>
          </BreadcrumbItem>
          <ChevronRight className="h-4 w-4 mt-1 text-muted-foreground" />
          <BreadcrumbItem> {data.invoiceNumber ?? "Invoice"}</BreadcrumbItem>
        </Breadcrumb>
      )}

      {isPending && "Loading..."}
      {isSuccess && data && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-5">
            <EditInvoices invoiceId={invoiceId} invoice={data} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceClient;
