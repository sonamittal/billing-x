"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
const User = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between px-9 py-4 mt-3">
        <h2 className="text-xl text-white font-bold">Home Page</h2>
        <button
          onClick={handleLogout}
          type="button"
          className="text-white bg-[#9a4141] font-medium px-6 py-1.5 rounded-sm cursor-pointer"
        >
          Logout
        </button>
      </div>
    </>
  );
};
export default User;
