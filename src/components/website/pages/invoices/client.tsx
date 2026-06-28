"use client";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Message from "@/components/ui/message";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Invoice } from "@/app/api/panel/invoices/[invoiceId]/type";
import EditInvoices from "@/components/website/pages/invoices/edit";

interface props {
  invoiceId: string;
}

const InvoiceClient = ({ invoiceId }: props) => {
  // Fetch users
  const { data, error, isPending, isSuccess } = useQuery<Invoice, Error>({
    queryKey: ["invoices", invoiceId],
    queryFn: async () => {
      try {
        const res = await axios.get<Invoice>(
          `/api/panel/invoices/${invoiceId}`,
        );
        return res.data;
      } catch (error) {
        const err = error as AxiosError<{ error: string }>;
        throw new Error(
          err.response?.data?.error ?? "Failed to fetch customer",
        );
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <EditInvoices />
            <div className="grid grid-cols-1 gap-5 h-fit"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceClient;
