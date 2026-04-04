import React from "react";
import MainLayout from "@/app/mainLayout";
import ProductDetailView from "@/components/pages/ProductDetail";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata = pageTab(
  "Product editor",
  "Review and update how this product appears in your KartSquare supplier dashboard.",
);

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <MainLayout>
      <ProductDetailView productId={id} />
    </MainLayout>
  );
}
