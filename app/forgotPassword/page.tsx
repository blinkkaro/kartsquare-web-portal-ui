import ForgetPasswordView from "@/components/pages/forgetPassword";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | kartsquare Portal",
  description: "Reset your kartsquare account password",
};

export default function ForgetPassword() {
  return <ForgetPasswordView />;
}
