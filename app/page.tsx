import type { Metadata } from "next";
import MainLayout from "./mainLayout";
import HomeView from "@/components/pages/home";
import { seoPublic } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";

const homeFallback = seoPublic({
  title: "KartSquare – B2B marketplace & local services",
  description:
    "KartSquare connects you with verified suppliers, technicians, and service providers across India — from home repairs and cleaning to industrial supplies and wholesale products. Book services and discover businesses you can trust.",
  path: "/",
  keywords: [
    "KartSquare",
    "B2B marketplace India",
    "book services online",
    "verified suppliers",
    "home services India",
    "Jaipur technicians",
    "wholesale products India",
  ],
});

export async function generateMetadata(): Promise<Metadata> {
  return sitePageSeoOrFallback("home", homeFallback);
}

export default function Home() {
  return (
    <MainLayout>
      <HomeView />
    </MainLayout>
  );
}
