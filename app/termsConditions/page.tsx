import TermsConditionsView from "@/components/pages/termsConditions";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Terms & Conditions",
  description:
    "Read KartSquare's official terms and conditions for using the marketplace, booking services, supplier policies, and user responsibilities.",
  path: "/termsConditions",
});

export default function TermsConditions() {
  return <TermsConditionsView />;
}
