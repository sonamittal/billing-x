"use client";
import { useRouter } from "next/navigation";
const OrgAccessInvoiceBtn = ({ orgName }: { orgName: String }) => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md sm:max-w-lg p-4 sm:p-6 md:p-8  border rounded-lg shadow-md text-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
          Organization already exists!
        </h2>
        <p className="mb-5">
          Your organization: <strong>{orgName}</strong>
        </p>
        <button
          className="px-4 py-2 bg-[#0a6e14] text-white rounded hover:bg-[#198424]"
          onClick={() => router.push("/panel/dashboard")}
        >
          Aceess Invoice{" "}
        </button>
      </div>
    </div>
  );
};
export default OrgAccessInvoiceBtn;
