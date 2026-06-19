"use client";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Message from "@/components/ui/message";
import EditCustomer from "@/components/website/pages/customers/edit-customers/edit";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import UserCard from "@/components/website/pages/customers/edit-customers/user-card";
import DeleteCustomer from "@/components/website/pages/customers/edit-customers/delete";
import EditDetails from "@/components/website/pages/customers/edit-customers/edit-details";
import type { GetCustomerById } from "@/app/api/panel/customers/[customerId]/type";

interface props {
  customerId: string;
}

const CustomersClient = ({ customerId }: props) => {
  // Fetch users
  const { data, error, isPending, isSuccess } = useQuery<
    GetCustomerById,
    Error
  >({
    queryKey: ["customers", customerId],
    queryFn: async () => {
      try {
        const res = await axios.get<GetCustomerById>(
          `/api/panel/customers/${customerId}`,
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
    enabled: !!customerId,
  });
  console.log(data);

  if (!customerId) {
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
            <a className="font-light" href="/panel/customers">
              Customers
            </a>
          </BreadcrumbItem>
          <ChevronRight className="h-4 w-4 mt-1 text-muted-foreground" />
          <BreadcrumbItem>{data.user?.name ?? "Unknown"}</BreadcrumbItem>
        </Breadcrumb>
      )}

      {isPending && "Loading..."}
      {isSuccess && data && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <EditCustomer
              customer={data}
              customerId={data.id}
              callback="/panel/customers"
            />
            <div className="grid grid-cols-1 gap-5 h-fit">
              {data.user && <UserCard user={data.user} userId={data.user.id} />}
              <DeleteCustomer customer={data} />
            </div>
          </div>
          <div className="mt-10">
            <EditDetails customer={data} callback="/panel/customers" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersClient;
