import { Suspense } from "react";
import VerifyForm from "@/app/(pages)/auth/verify/VerifyForm";
const VerifyFormPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyForm />
    </Suspense>
  );
};
export default VerifyFormPage;
