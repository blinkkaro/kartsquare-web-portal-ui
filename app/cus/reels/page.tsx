import type { Metadata } from "next";
import ReelsView from "@/components/pages/reels";
import { seoPublic } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";

const reelsFallback = seoPublic({
  title: "Reels — short videos from providers & suppliers",
  description:
    "Watch and explore short videos from KartSquare service providers and suppliers. Discover local businesses and products in seconds.",
  path: "/cus/reels",
  keywords: [
    "KartSquare reels",
    "business videos India",
    "local services video",
    "supplier shorts",
  ],
});

export async function generateMetadata(): Promise<Metadata> {
  return sitePageSeoOrFallback("reels", reelsFallback);
}

export default function ReelsPage() {
  return <ReelsView />;
}
