import { render } from "@react-email/render";

import mailTransporter from "./mail-transporter";
import VerificationCodeTemplate from "@/config/mail/templates";

interface Recipient {
  email: string;
  name: string;
}
let fromMail = "sonaji@bytewyte.com";
export const sendVerificationCode = async (
  verificationCode: string,
  recipient: Recipient,
  subject: string,
) => {
  try {
    const transporter = mailTransporter();

    const html = await render(
      <VerificationCodeTemplate
        verificationCode={verificationCode}
        recipientName={recipient.name}
      />,
      {
        pretty: true,
      },
    );

    const info = await transporter.sendMail({
      from: `Verification Code <${fromMail}>`,
      to: recipient.email,
      subject,
      html,
    });

    return info;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
