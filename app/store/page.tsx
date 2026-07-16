import type { Metadata } from "next";
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

export default function StorePage() {
  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeItemListJsonLd) }}
      />
      <StoreView />
    </MainLayout>
  );
}
