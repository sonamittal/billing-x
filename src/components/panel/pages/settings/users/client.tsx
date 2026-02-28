"use client";
import React from "react";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Message from "@/components/ui/message";
import EditUser from "@/components/panel/pages/settings/users/edit";
import { Dialog } from "@/components/ui/dialog";
import { notFound } from "next/navigation";
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
    <div className="mx-4">
      <Message
        variant={error ? "destructive" : "default"}
        message={error?.message}
        className="mt-3"
      />
      {!error && data && (
        <Breadcrumb className="mb-5">
          <BreadcrumbItem>
            <a href="/panel/users">Users</a>
          </BreadcrumbItem>
          <BreadcrumbItem>
            {data.name || data.username || "Unknown"}
          </BreadcrumbItem>
        </Breadcrumb>
      )}

      {isPending && "Loading..."}
      {isSuccess && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Dialog defaultOpen>
            <EditUser user={data} />
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default UsersClient;
