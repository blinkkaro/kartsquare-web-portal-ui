import React, { Suspense } from "react";
import MainLayout from "../mainLayout";
import SearchResultsView from "@/components/pages/search";
import { Box } from "@mui/material";
import CenteredLoader from "@/components/common/Loader/CenteredLoader";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "Search Products & Services",
  description:
    "Search KartSquare for products, services, suppliers, and providers. Filter results and compare options in one place.",
  path: "/search",
  keywords: ["search products India", "find services online", "KartSquare search"],
});

export default function SearchPage() {
  return (
    <MainLayout>
      <Suspense fallback={<CenteredLoader />}>
        <SearchResultsView />
      </Suspense>
    </MainLayout>
  );
}
