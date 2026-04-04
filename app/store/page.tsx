import type { Metadata } from "next";
import MainLayout from "@/app/mainLayout";
import StoreView from "@/components/pages/store";
import { seoPublic } from "@/lib/seo/buildMetadata";
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

export default function StorePage() {
  return (
    <MainLayout>
      <StoreView />
    </MainLayout>
  );
}
