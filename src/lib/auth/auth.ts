import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/database/db-connect"; // your drizzle instance
import { emailOTP } from "better-auth/plugins";
import { admin as adminPlugin } from "better-auth/plugins";
import { user } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

import {
  ac,
  admin,
  staff,
  staffAssigned,
  timesheetStaff,
} from "@/lib/auth/permissions";
import { sendVerificationCode } from "@/config/mail/mail-sender";

interface SendVerificationOtpParams {
  email: string;
  otp: string;
  type: "sign-in" | "change-email" | "email-verification" | "forget-password";
}
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // autoSignIn: false,
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 400,
      allowedAttempts: 5,
      disableSignUp: false,
      async sendVerificationOTP({
        email,
        otp,
        type,
      }: SendVerificationOtpParams) {
        //   let message: string;
        //   if (type === "sign-in") {
        //     // Send the OTP for sign in
        //     message = `Sign-in OTP:${otp}`;
        //   } else if (type === "email-verification") {
        //     // Send the OTP for email verification
        //     message = `Email Verification OTP: ${otp}`;
        //   } else {
        //     // Send the OTP for password reset
        //     message = `Password Reset OTP: ${otp}`;
        //   }
        //   console.log("otp:", { email, otp, message });
        // },
        let subject = "Verification Code";

        switch (type) {
          case "sign-in":
            subject = "Sign In OTP";
            break;

          case "email-verification":
            subject = "Email Verification OTP";
            break;

          case "forget-password":
            subject = "Password Reset OTP";
            break;

          case "change-email":
            subject = "Change Email OTP";
            break;
        }
        try {
          const [existingUser] = await db
            .select({
              name: user.name,
            })
            .from(user)
            .where(eq(user.email, email))
            .limit(1);

          await sendVerificationCode(
            otp,
            {
              email,
              name: existingUser?.name ?? "User",
            },
            subject,
          );
          console.log(`OTP sent successfully to ${email}`);
        } catch (error) {
          console.error("Failed to send OTP:", error);

          if (error instanceof Error) {
            throw error;
          }

          throw error;
        }
      },
    }),
    adminPlugin({
      ac,
      roles: {
        admin,
        staff,
        staffAssigned,
        timesheetStaff,
      },
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_BETTER_AUTH_URL || ""],
});
