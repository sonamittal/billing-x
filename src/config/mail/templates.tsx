import {
  Html,
  Head,
  Preview,
  Tailwind,
  Body,
  Container,
  Heading,
  Text,
} from "@react-email/components";
import { AUTH_SETTINGS } from "@/lib/constants";
interface VerificationCodeTemplateProps {
  verificationCode: string;
  recipientName: string;
}

export default function VerificationCodeTemplate({
  verificationCode,
  recipientName,
}: VerificationCodeTemplateProps) {
  return (
    <Html>
      <Head />

      <Preview>Your verification code</Preview>

      <Tailwind>
        <Body className="bg-gray-100 py-10">
          <Container className="mx-auto max-w-md rounded-lg bg-white p-8">
            <Heading className="text-2xl font-bold">Email Verification</Heading>

            <Text>Dear {recipientName},</Text>

            <Text>Your verification code is:</Text>

            <Text className="my-6 text-center text-3xl font-bold tracking-[8px] text-blue-600">
              {verificationCode}
            </Text>

            <Text>
              and is valid for {AUTH_SETTINGS.verificationCodeExpiryTime}{" "}
              minutes.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
