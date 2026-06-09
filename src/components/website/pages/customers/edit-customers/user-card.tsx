"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, User, SquarePen, CheckCircle2, XCircle } from "lucide-react";

interface UserData {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  banned?: boolean;
  role?: string;
  emailVerified?: boolean;
  createdAt?: string;
}

interface UserCardProps {
  user: UserData;
  userId?: string;
}

const UserCard = ({ user, userId }: UserCardProps) => {
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <CardTitle className="text-base flex gap-2 items-center font-semibold text-zinc-900 dark:text-zinc-100">
          <User className="h-5 w-5" /> User Profile
        </CardTitle>

        {userId && (
          <Link href={`/panel/users/${userId}`}>
            <Button size="sm" className="gap-1 w-full sm:w-auto">
              <SquarePen className="h-4 w-4" />
              Edit
            </Button>
          </Link>
        )}
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* USER INFO */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              )}
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                {user.name || "Unknown User"}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {user.id}
              </p>
            </div>
          </div>

          {/* STATUS */}
          <div className="self-start sm:self-auto">
            {user.banned ? (
              <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 font-medium">
                Banned
              </span>
            ) : (
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400 font-medium">
                Active
              </span>
            )}
          </div>
        </div>

        <Separator className="bg-zinc-300 dark:bg-zinc-800" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-2 rounded-lg dark:bg-[#262321] bg-[#F5F5F4]">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Role</p>
            <p className="font-medium text-zinc-800 dark:text-zinc-100">
              {user.role || "user"}
            </p>
          </div>

          <div className="p-2 rounded-lg dark:bg-[#262321] bg-[#F5F5F4]">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">Joined</p>
            <p className="font-medium text-zinc-800 dark:text-zinc-100">
              {joinedDate}
            </p>
          </div>
        </div>

        {/* EMAIL */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg bg-[#F5F5F4] dark:bg-[#262321]">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="h-4 w-4  text-zinc-700 dark:text-zinc-300 shrink-0" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">
              {user.email}
            </span>
          </div>

          <span
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium w-fit ${
              user.emailVerified
                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
            }`}
          >
            {user.emailVerified ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Not Verified
              </>
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
