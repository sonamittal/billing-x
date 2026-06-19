import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteCustomerDialog from "@/components/website/pages/customers/edit-customers/delete-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import type { GetCustomerById } from "@/app/api/panel/customers/[customerId]/type";

interface CustomerIdProps {
  customer: GetCustomerById;
}

const DeleteCustomer = ({ customer }: CustomerIdProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  return (
    <>
      <Card className="bg-destructive/10 border-destructive h-fit w-full">
        <CardHeader>
          <div className="border-destructive bg-transparent text-destructive">
            <Trash strokeWidth={1} />
          </div>
          <CardTitle className="text-destructive text-lg">
            Delete account
          </CardTitle>
          <CardDescription>
            This will permanently delete{" "}
            <span className="text-foreground font-medium">
              {(customer.user?.name ?? "Unknown") + "'s"}
            </span>{" "}
            account and it{"'"}s data from the server.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              setIsDeleteDialogOpen(true);
            }}
          >
            Delete Customer
          </Button>
        </CardContent>
      </Card>
      <DeleteCustomerDialog
        customer={customer}
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        callback="/panel/customers"
      />
    </>
  );
};
export default DeleteCustomer;
