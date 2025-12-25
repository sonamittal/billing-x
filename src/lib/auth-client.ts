import { createAuthClient } from "better-auth/client";
import { nextCookies } from "better-auth/next-js";
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [nextCookies()],
});
export const { signIn, signUp, useSession } = authClient;
