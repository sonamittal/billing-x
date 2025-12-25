import { auth } from "@/lib/auth";

export const handleSignup = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    await auth.api.signUpEmail({
      body: { name, email, password },
    });

    return await auth.api.signInEmail({
      body: { email, password },
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    throw error;
  }
};

export const handleSignin = async (email: string, password: string) => {
  try {
    return await auth.api.signInEmail({
      body: { email, password },
    });
  } catch (error) {
    console.error("SIGNIN ERROR:", error);
    throw error;
  }
};
