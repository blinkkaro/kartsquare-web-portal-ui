import type { Metadata } from "next";
import { Suspense } from "react";
import { Box, Typography } from "@mui/material";
import MainLayout from "@/app/mainLayout";
import StoreView from "@/components/pages/store";
import { seoPublic, SITE_URL } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";

const storeFallback = seoPublic({
  title: "Store — products from verified suppliers",
  description:
    "Browse wholesale and retail products on KartSquare — electronics, industrial supplies, textiles, chemicals, and more from verified Indian suppliers.",
  path: "/store",
  keywords: [
    "B2B products India",
    "verified suppliers",
    "wholesale marketplace",
    "KartSquare store",
  ],
});

export async function generateMetadata(): Promise<Metadata> {
  return sitePageSeoOrFallback("store", storeFallback);
}

/** ItemList JSON-LD: signals to Google that this is a product listing/catalog page. */
const storeItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "KartSquare Store — Products from Verified Suppliers",
  description:
    "Browse wholesale and retail products on KartSquare — electronics, industrial supplies, textiles, chemicals, and more from verified Indian suppliers.",
  url: `${SITE_URL}/store`,
};

/**
 * StoreView reads useSearchParams, which requires a Suspense boundary so this
 * route can still prerender. The fallback carries real page copy (not a blank
 * spinner) so crawlers that see the pre-hydration frame still get an H1 and
 * text instead of nothing.
 */
function StoreFallback() {
  return (
    <Box sx={{ textAlign: "center", py: { xs: 6, md: 10 } }}>
      <Typography variant="h4" component="h1" fontWeight={900} sx={{ mb: 2 }}>
        Store — products from verified suppliers
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
        Browse wholesale and retail products on KartSquare — electronics,
        industrial supplies, textiles, chemicals, and more from verified
        Indian suppliers.
      </Typography>
    </Box>
  );
}

export default function StorePage() {
  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeItemListJsonLd) }}
      />
      <Suspense fallback={<StoreFallback />}>
        <StoreView />
      </Suspense>
    </MainLayout>
  );
}
