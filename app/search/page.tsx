import React, { Suspense } from "react";
import MainLayout from "../mainLayout";
import SearchResultsView from "@/components/pages/search";
import { Box } from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import { seoPublic, SITE_URL } from "@/lib/seo/buildMetadata";
import type { Metadata } from "next";

/** Base (canonical) metadata for the /search page — always indexable. */
const baseSearchMetadata = seoPublic({
  title: "Search Products & Services",
  description:
    "Search kartsquare for products, services, suppliers, and providers. Filter results and compare options in one place.",
  path: "/search",
  keywords: ["search products India", "find services online", "kartsquare search"],
});

/**
 * generateMetadata is dynamic so we can inspect searchParams.
 *
 * Google's guidance: search result pages with query parameters (e.g. ?q=...)
 * should be noindex — they have no unique content and create near-infinite
 * crawlable URLs that drain crawl budget. The base /search page (no ?q=)
 * is fine to index.
 *
 * The canonical always points to /search (no params) so all param variants
 * converge on the same canonical URL.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const hasQuery = Boolean(params?.q);

  return {
    ...baseSearchMetadata,
    // Canonical always points to the base /search URL without params.
    alternates: {
      canonical: `${SITE_URL}/search`,
      languages: { "en-IN": `${SITE_URL}/search` },
    },
    // When ?q= is present: noindex to prevent crawl budget drain on query variants.
    // When no ?q=: keep the base /search page indexable.
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  };
}

export default function SearchPage() {
  return (
    <MainLayout>
      <Suspense fallback={<CenteredLoader />}>
        <SearchResultsView />
      </Suspense>
    </MainLayout>
  );
}
