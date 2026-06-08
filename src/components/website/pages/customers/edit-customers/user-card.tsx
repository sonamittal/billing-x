"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, User, SquarePen } from "lucide-react";

interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
}

interface UserCardProps {
  user: User;
  userId?: string;
}

const UserCard = ({ user, userId }: UserCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <User />
          <CardTitle>User Profile</CardTitle>
        </div>

        {userId && (
          <Link href={`/panel/users/${userId}`}>
            <Button className="flex items-center gap-1">
              <SquarePen className="h-3 w-3" />
              Edit
            </Button>
          </Link>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-start">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={40}
                height={40}
                className="h-10 w-10 object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-primary" />
            )}
          </div>

          <p className="mt-3 rounded-full bg-black text-white px-3 py-1 font-medium">
            {user.id}
          </p>

          <div className="mt-3 flex gap-2">
            <Badge>Active</Badge>
            <Badge>Verified</Badge>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Joined Jan 12, 2025</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
