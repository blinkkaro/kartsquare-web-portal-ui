import ResetPasswordView from "@/components/pages/resetPassword";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata = seoAuth({
  title: "Reset password",
  description:
    "Choose a new secure password for your KartSquare account after verifying your reset link.",
});

export default function ResetPassword() {
  return <ResetPasswordView />;
}
