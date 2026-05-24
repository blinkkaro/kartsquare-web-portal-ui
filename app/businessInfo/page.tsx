import BusinessInfoView from "@/components/pages/businessInfo";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Business information",
  description:
    "Tell KartSquare about your business — name, category, and contact details — to complete your profile and improve discovery.",
  path: "/businessInfo",
});

export default function BusinessInfo() {
  return (
    <BusinessInfoView />
  );
}
