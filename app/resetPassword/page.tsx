import ResetPasswordView from "@/components/pages/resetPassword";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | kartsquare Portal",
  description: "Set a new password for your kartsquare account",
};

export default function ResetPassword() {
  return <ResetPasswordView />;
}
