import type { Metadata } from "next";
import MainLayout from "@/app/mainLayout";
import StoreProductsView from "@/components/pages/store/ProductsListing";
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

export default function StoreProductsPage() {
  return (
    <MainLayout>
      <StoreProductsView />
    </MainLayout>
  );
}
