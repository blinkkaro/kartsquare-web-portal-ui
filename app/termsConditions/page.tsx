import TermsConditionsView from "@/components/pages/termsConditions";
import { seoPublic, SITE_URL } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Terms & Conditions",
  description:
    "Read KartSquare's official terms and conditions for using the marketplace, booking services, supplier policies, and user responsibilities.",
  path: "/termsConditions",
});

const termsWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms & Conditions",
  description:
    "KartSquare terms of use: marketplace rules, bookings, supplier obligations, and user responsibilities.",
  url: `${SITE_URL}/termsConditions`,
  isPartOf: {
    "@type": "WebSite",
    name: "KartSquare",
    url: SITE_URL,
  },
};

export default function TermsConditions() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsWebPageJsonLd) }}
      />
      <TermsConditionsView />
    </>
  );
}
