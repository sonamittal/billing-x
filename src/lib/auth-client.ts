import { createAuthClient } from "better-auth/react";
import { nextCookies } from "better-auth/next-js";
import { emailOTPClient } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";
import {
  ac,
  admin,
  staff,
  staffAssigned,
  timesheetStaff,
} from "@/lib/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [
    nextCookies(),
    emailOTPClient(),
    adminClient({
      ac,
      roles: {
        admin,
        staff,
        staffAssigned,
        timesheetStaff,
      },
    }),
  ],
});
