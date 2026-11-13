import type { Metadata } from "next";
import React from "react";
import MainLayout from "../mainLayout";
import MapeView from "@/components/pages/map";
import { seoPublic, SITE_URL } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumbs";

const mapFallback = seoPublic({
  title: "Map — find businesses & services",
  description:
    "Explore kartsquare providers, suppliers, and service areas on an interactive map. Discover local professionals near you.",
  path: "/map",
  keywords: ["service map", "local providers India", "business map kartsquare"],
});

export async function generateMetadata(): Promise<Metadata> {
  return sitePageSeoOrFallback("map", mapFallback);
}

const mapWebPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Map — find businesses & services | kartsquare",
  description:
    "Explore kartsquare providers, suppliers, and service areas on an interactive map. Discover local professionals near you.",
  url: `${SITE_URL}/map`,
  isPartOf: { "@type": "WebSite", url: SITE_URL, name: "kartsquare" },
};

export default function MapPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Map", item: "/map" },
  ]);

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mapWebPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <MapeView />
    </MainLayout>
  );
}
