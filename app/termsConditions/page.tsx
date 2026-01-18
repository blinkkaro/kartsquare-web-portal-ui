import TermsConditionsView from "@/components/pages/termsConditions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | KartSquare Portal",
  description: "KartSquare terms and conditions of service",
};

export default function TermsConditions() {
  return <TermsConditionsView />;
}
