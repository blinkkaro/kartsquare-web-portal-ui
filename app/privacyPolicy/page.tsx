import PrivacyPolicyView from "@/components/pages/privacyPolicy";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Privacy Policy | KartSquare",
  description:
    "How KartSquare collects, uses, and protects your personal data across our marketplace, bookings, and supplier tools.",
  path: "/privacyPolicy",
  keywords: [
    "KartSquare privacy policy",
    "data protection India",
    "personal data use",
    "GDPR compliance",
  ],
});

export default function PrivacyPolicy() {
  return <PrivacyPolicyView />;
}
