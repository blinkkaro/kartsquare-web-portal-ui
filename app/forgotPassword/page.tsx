import ForgetPasswordView from "@/components/pages/forgetPassword";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | KartSquare Portal",
  description: "Reset your KartSquare account password",
};

export default function ForgetPassword() {
  return <ForgetPasswordView />;
}
