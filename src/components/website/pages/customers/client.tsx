"use client";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Message from "@/components/ui/message";
import EditCustomer from "@/components/website/pages/customers/edit-customers/edit";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import UpdateUserPassword from "@/components/panel/pages/settings/users/update-password";
import DeleteUser from "@/components/panel/pages/settings/users/delete";
import EditDetails from "@/components/website/pages/customers/edit-customers/edit-details";

interface props {
  customerId: string;
}

const CustomersClient = ({ customerId }: props) => {
  // Fetch users
  const { data, error, isPending, isSuccess } = useQuery({
    queryKey: ["customers", customerId],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/panel/customers/${customerId}`);
        return data;
      } catch (error: any) {
        throw new Error(error.response.data.error);
      }
    },
    retry: false,
  });
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
            <a className="text-[#e8dad0] " href="/customers/${customerId}">
              customers
            </a>
          </BreadcrumbItem>
          <ChevronRight className="h-4 w-4 mt-1 text-muted-foreground" />
          <BreadcrumbItem>
            {data?.name ?? data?.username ?? "Unknown"}
          </BreadcrumbItem>
        </Breadcrumb>
      )}

      {isPending && "Loading..."}
      {isSuccess && data && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <EditCustomer user={data} callback="/panel/customers" />
            <div className="grid grid-cols-1 gap-5 h-fit">
              <UpdateUserPassword user={data} />
              <DeleteUser user={data} />
            </div>
          </div>
          <div className="mt-10">
            <EditDetails />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersClient;
