import type { Metadata } from "next";
import FeedView from "@/components/pages/feed";
import { seoPublic } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";

const feedFallback = seoPublic({
  title: "Feed — stories, posts and reels from local providers",
  description:
    "See stories, photos and reels from kartsquare service providers, suppliers and people near you. Follow, like, comment and save posts.",
  path: "/cus/feed",
  keywords: ["kartsquare feed", "local business posts", "provider stories", "service reels"],
});

export async function generateMetadata(): Promise<Metadata> {
  return sitePageSeoOrFallback("feed", feedFallback);
}

export default function FeedPage() {
  return <FeedView />;
}
