import { Suspense } from "react";
import VerifyForm from "@/components/auth/VerifyForm";
const VerifyFormPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyForm />
    </Suspense>
  );
};
export default VerifyFormPage;
