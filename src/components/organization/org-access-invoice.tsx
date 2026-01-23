"use client";
import { useRouter } from "next/navigation";
const OrgAccessInvoiceBtn = ({ orgName }: { orgName: String }) => {
  const router = useRouter();
  return (
    <div className="p-6 border rounded-lg shadow-md max-w-md mx-auto mt-10 text-center">
      <h2 className="text-xl font-bold mb-2">Organization already exists!</h2>
      <p className="mb-4">
        Your organization: <strong>{orgName}</strong>
      </p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => router.push("/")}
      >
        Aceess Invoice{" "}
      </button>
    </div>
  );
};
export default OrgAccessInvoiceBtn;
