import { createAuthClient } from "better-auth/client";
import { nextCookies } from "better-auth/next-js";
import { emailOTPClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000/api/auth",
  plugins: [nextCookies(), emailOTPClient()],
});

export const { signIn, signUp, useSession } = authClient;
