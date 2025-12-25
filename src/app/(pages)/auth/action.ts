"use server";
import { auth } from "@/lib/auth";

export const handleSignup = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const response = await auth.api.signUpEmail({
      body: { name, email, password },
    });
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const handleSignin = async (email: string, password: string) => {
  try {
    const response = await auth.api.signInEmail({
      body: { email, password },
    });
    return response;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
