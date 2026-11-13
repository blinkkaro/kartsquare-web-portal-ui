import type { Metadata } from "next";
import { Suspense } from "react";
import { manifestCopy } from "@/lib/seo/metaManifest";
import { seoPublic, SITE_URL } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";
import ListOfServices from "../../../components/pages/servicesList";

import { buildBreadcrumbJsonLd, BREADCRUMBS } from "@/lib/seo/breadcrumbs";

const servicesListFallback = seoPublic({
  ...(manifestCopy("services_list") ?? {
    title: "Browse services \u2014 book home & professional help",
    description:
      "Discover and book home repairs, cleaning, beauty, wellness, and professional services from verified kartsquare providers across India.",
  }),
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

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const md = await sitePageSeoOrFallback("services_list", servicesListFallback);
  const { category, search } = await searchParams;
  const categoryId = Array.isArray(category) ? category[0] : category;
  const searchTerm = Array.isArray(search) ? search[0] : search;
  // Free-text search results are infinite near-duplicate pages: keep them out of
  // the index and point them at the bare listing.
  if (searchTerm && !categoryId) {
    return {
      ...md,
      alternates: { ...md.alternates, canonical: `${SITE_URL}/cus/services-list` },
      robots: { index: false, follow: true },
    };
  }
  if (!categoryId) return md;
  // Each category page gets its own canonical, so Google indexes them separately
  // instead of collapsing every ?category=<id> view into the bare listing URL.
  const canonical = `${SITE_URL}/cus/services-list?category=${encodeURIComponent(categoryId)}`;
  return { ...md, alternates: { ...md.alternates, canonical } };
}

export default function ServicesListPage() {
  const jsonLd = buildBreadcrumbJsonLd(BREADCRUMBS.SERVICES);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      {/* useSearchParams (deep-linked category/search) needs a Suspense boundary */}
      <Suspense fallback={null}>
        <ListOfServices />
      </Suspense>
    </>
  );
}
