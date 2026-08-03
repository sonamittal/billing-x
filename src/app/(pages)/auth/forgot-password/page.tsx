import { Suspense } from "react";
import ForgotPasswordForm from "@/app/(pages)/auth/forgot-password/ForgotPassword";
const ForgotPasswordFormPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
};
export default ForgotPasswordFormPage;
