import type { Metadata } from "next";
import { Suspense } from "react";
import { Box, Typography } from "@mui/material";
import MainLayout from "@/app/mainLayout";
import StoreProductsView from "@/components/pages/store/ProductsListing";
import { buildBreadcrumbJsonLd, BREADCRUMBS } from "@/lib/seo/breadcrumbs";
import { seoPublic } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";

const storeProductsFallback = seoPublic({
  title: "Browse all products",
  description:
    "Search and filter products from KartSquare suppliers — compare prices, SKUs, and availability across categories.",
  path: "/store/products",
  keywords: ["product catalog", "supplier products", "B2B catalog India"],
});

export async function generateMetadata(): Promise<Metadata> {
  return sitePageSeoOrFallback("store_products", storeProductsFallback);
}

/** Real fallback copy for the useSearchParams Suspense boundary — see /store for why. */
function StoreProductsFallback() {
  return (
    <Box sx={{ textAlign: "center", py: { xs: 6, md: 10 } }}>
      <Typography variant="h3" component="h1" fontWeight={900} sx={{ mb: 2 }}>
        Browse all products
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
        Search and filter products from KartSquare suppliers — compare
        prices, SKUs, and availability across categories.
      </Typography>
    </Box>
  );
}

export default function StoreProductsPage() {
  const jsonLd = buildBreadcrumbJsonLd(BREADCRUMBS.STORE);

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Suspense fallback={<StoreProductsFallback />}>
        <StoreProductsView />
      </Suspense>
    </MainLayout>
  );
}
