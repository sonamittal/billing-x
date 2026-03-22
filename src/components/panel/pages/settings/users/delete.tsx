import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteUserDialog from "@/components/panel/pages/settings/users/delete-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
interface userIdProps {
  user: any;
}

const DeleteUser = ({ user }: userIdProps) => {
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
              {(user.username ?? user.name ?? "Unknown") + "'s"}
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
            Delete user
          </Button>
        </CardContent>
      </Card>
      <DeleteUserDialog
        user={user}
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        callback="/panel/users"
      />
    </>
  );
};
export default DeleteUser;
