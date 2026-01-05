import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/database/db-connect"; // your drizzle instance
import { emailOTP } from "better-auth/plugins";

interface SendVerificationOtpParams {
  email: string;
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password";
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
        let message: string;
        if (type === "sign-in") {
          // Send the OTP for sign in
          message = `Sign-in OTP:${otp}`;
        } else if (type === "email-verification") {
          // Send the OTP for email verification
          message = `Email Verification OTP: ${otp}`;
        } else {
          // Send the OTP for password reset
          message = `Password Reset OTP: ${otp}`;
        }
        console.log("otp:", { email, otp, message });
      },
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  trustedOrigins: ["http://localhost:3000"],
});
