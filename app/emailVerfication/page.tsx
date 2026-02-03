import EmailVerificationView from "@/components/pages/emailVerfication";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Verification | kartsquare Portal",
  description: "Verify your email address",
};

export default function EmailVerification() {
  return <EmailVerificationView />;
}
