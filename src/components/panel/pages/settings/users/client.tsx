"use client";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Message from "@/components/ui/message";
import EditUser from "@/components/panel/pages/settings/users/edit";
import { notFound } from "next/navigation";
import{ChevronRight} from "lucide-react"

interface props {
  userId: string;
}

const UsersClient = ({ userId }: props) => {
  // Fetch users
  const { data, error, isPending, isSuccess } = useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`/api/panel/users/${userId}`);
        return data;
      } catch (error: any) {
        throw new Error(error.response.data.error);
      }
    },
    retry: false,
  });
  if (!userId) {
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
            <a className = "text-[#e8dad0] "href="/panel/users">Users</a>
          </BreadcrumbItem>
            <ChevronRight className="h-4 w-4 mt-1 text-muted-foreground" />
          <BreadcrumbItem>
            {data?.name ??  data?.username ?? "Unknown"}
          </BreadcrumbItem>
        </Breadcrumb>
      )}

      {isPending && "Loading..."}
      {isSuccess && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <EditUser user={data} />
        </div>
      )}
    </div>
  );
};

export default UsersClient;
