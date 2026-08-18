import type { Metadata } from "next";
import { seoPublic } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";
import ListOfServices from "../../../components/pages/servicesList";

import { buildBreadcrumbJsonLd, BREADCRUMBS } from "@/lib/seo/breadcrumbs";

const servicesListFallback = seoPublic({
  title: "Browse services \u2014 book home & professional help",
  description:
    "Discover and book home repairs, cleaning, beauty, wellness, and professional services from verified kartsquare providers across India.",
  path: "/services",
  keywords: [
    "book services online India",
    "home services near me",
    "kartsquare services",
    "verified technicians",
    "professional services India",
    "home repair booking",
  ],
});

export async function generateMetadata(): Promise<Metadata> {
  return sitePageSeoOrFallback("services_list", servicesListFallback);
}

export default function ServicesListPage() {
  const jsonLd = buildBreadcrumbJsonLd(BREADCRUMBS.SERVICES);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <ListOfServices />
    </>
  );
}
