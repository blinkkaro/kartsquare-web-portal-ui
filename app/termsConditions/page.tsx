import TermsConditionsView from "@/components/pages/termsConditions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | kartsquare Portal",
  description: "kartsquare terms and conditions of service",
};

export default function TermsConditions() {
  return <TermsConditionsView />;
}
