import SignUpView from "@/components/pages/signUpPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | kartsquare Portal",
  description: "Create your kartsquare account",
};

export default function SignUp() {
  return <SignUpView />;
}
