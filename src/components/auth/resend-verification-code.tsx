import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

const ResendVerificationCode = ({ email }: { email: string }) => {
  // resend otp
  const {
    mutate: sendVerificationCode,
    isPending: isSendVerificationCodePending,
  } = useMutation({
    mutationFn: async () => {
      if (!email) return;
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in", // required
      });
    },
    onSuccess: () => {
      console.log("OTP sent on your email.");
    },
    onError: (error: any) => {
      console.log(error.message);
    },
  });
  return (
    <p
      onClick={() => sendVerificationCode()}
      className="text-sm float-right font-medium text-primary cursor-pointer"
    >
      {isSendVerificationCodePending ? "Sending..." : "Resend code"}
    </p>
  );
};
export default ResendVerificationCode;
