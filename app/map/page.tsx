import type { Metadata } from "next";
import React from "react";
import MainLayout from "../mainLayout";
import MapeView from "@/components/pages/map";
import { seoPublic } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";

const mapFallback = seoPublic({
  title: "Map — find businesses & services",
  description:
    "Explore KartSquare providers, suppliers, and service areas on an interactive map. Discover local professionals near you.",
  path: "/map",
  keywords: ["service map", "local providers India", "business map KartSquare"],
});

export async function generateMetadata(): Promise<Metadata> {
  return sitePageSeoOrFallback("map", mapFallback);
}

export default function MapPage() {
  return (
    <MainLayout>
      <MapeView />
    </MainLayout>
  );
}
