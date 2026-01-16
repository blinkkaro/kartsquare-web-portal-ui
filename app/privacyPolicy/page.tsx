import PrivacyPolicyView from "@/components/pages/privacyPolicy";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | KartSquare Portal",
  description: "KartSquare privacy policy and data handling practices",
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyView />;
}
