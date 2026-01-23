import PrivacyPolicyView from "@/components/pages/privacyPolicy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | kartsquare Portal",
  description: "kartsquare privacy policy and data handling practices",
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyView />;
}
