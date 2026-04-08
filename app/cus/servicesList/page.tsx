import type { Metadata } from "next";
import { seoPublic } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";
import ListOfServices from "../../../components/pages/servicesList";

import { buildBreadcrumbJsonLd, BREADCRUMBS } from "@/lib/seo/breadcrumbs";

const servicesListFallback = seoPublic({
  title: "Browse services — book home & professional help",
  description:
    "Discover and book home repairs, cleaning, beauty, wellness, and professional services from verified KartSquare providers across India.",
  path: "/cus/servicesList",
  keywords: [
    "book services online India",
    "home services near me",
    "KartSquare services",
    "verified technicians",
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
