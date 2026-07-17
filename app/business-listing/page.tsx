import type { Metadata } from "next";
import React from "react";
import MainLayout from "../mainLayout";
import ListingView from "@/components/pages/leading";
import { seoPublic, SITE_URL } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumbs";

const businessListingFallback = seoPublic({
  title: "List your business for free",
  description:
    "Register your company on KartSquare to reach buyers and service customers. Create a free business listing and grow visibility across India.",
  path: "/business-listing",
  keywords: [
    "free business listing",
    "list company India",
    "KartSquare registration",
    "B2B visibility",
  ],
});

export async function generateMetadata(): Promise<Metadata> {
  return sitePageSeoOrFallback("business_listing", businessListingFallback);
}

/** WebPage JSON-LD: helps Google categorise this as a lead-gen / registration page. */
const businessListingWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "List Your Business for Free | KartSquare",
  description:
    "Register your company on KartSquare to reach buyers and service customers. Create a free business listing and grow visibility across India.",
  url: `${SITE_URL}/business-listing`,
  isPartOf: { "@type": "WebSite", url: SITE_URL, name: "KartSquare" },
};

export default function FreeListing() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "List Your Business", item: "/business-listing" },
  ]);

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessListingWebPageJsonLd) }}
      />
      {breadcrumbJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
        />
      ) : null}
      <ListingView />
    </MainLayout>
  );
}
