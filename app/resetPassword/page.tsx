import ResetPasswordView from "@/components/pages/resetPassword";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | KartSquare Portal",
  description: "Set a new password for your KartSquare account",
};

export default function ResetPassword() {
  return <ResetPasswordView />;
}
