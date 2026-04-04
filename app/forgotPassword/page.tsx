import ForgotPasswordView from "@/components/pages/forgetPassword";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Forgot password",
  description:
    "Reset your KartSquare password securely. Enter your email to receive reset instructions.",
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
