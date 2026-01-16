import SignUpView from "@/components/pages/SignUp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | KartSquare Portal",
  description: "Create your KartSquare account",
};

export default function SignUp() {
  return <SignUpView />;
}
