import PrivacyPolicyView from "@/components/pages/privacyPolicy";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Privacy Policy",
  description:
    "How KartSquare collects, uses, and protects your personal data across our marketplace, bookings, and supplier tools.",
  path: "/privacyPolicy",
});

export default function PrivacyPolicy() {
  return <PrivacyPolicyView />;
}
