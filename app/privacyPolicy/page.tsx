import PrivacyPolicyView from "@/components/pages/privacyPolicy";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Privacy Policy | kartsquare",
  description:
    "How kartsquare collects, uses, and protects your personal data across our marketplace, bookings, and supplier tools.",
  path: "/privacy-policy",
  keywords: [
    "kartsquare privacy policy",
    "data protection India",
    "personal data use",
    "GDPR compliance",
  ],
});

export default function PrivacyPolicy() {
  return <PrivacyPolicyView />;
}
