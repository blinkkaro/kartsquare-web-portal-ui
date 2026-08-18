import EmailVerificationView from "@/components/pages/emailVerfication";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Verify email",
  description:
    "Confirm your email address to activate your kartsquare account and receive booking updates.",
});

export default function EmailVerification() {
  return <EmailVerificationView />;
}
