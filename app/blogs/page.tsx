import type { Metadata } from "next";
import React from "react";
import MainLayout from "../mainLayout";
import BlogView from "../../components/pages/blogs";
import { seoPublic } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";

const blogsFallback = seoPublic({
  title: "Blog — tips for services & marketplace",
  description:
    "Expert guides on home services, booking on KartSquare, supplier growth, and getting the most from India's B2B marketplace.",
  path: "/blogs",
  keywords: [
    "KartSquare blog",
    "home services tips",
    "service marketplace India",
    "small business growth",
  ],
});

export async function generateMetadata(): Promise<Metadata> {
  return sitePageSeoOrFallback("blogs", blogsFallback);
}

export default function Blog() {
  return (
    <MainLayout>
      <BlogView />
    </MainLayout>
  );
}
