import React from "react";
import MainLayout from "@/app/mainLayout";
import ProductDetailView from "@/components/pages/ProductDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details | KartSquare Store",
  description: "View detailed product information from verified suppliers",
};
export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MainLayout>
      <ProductDetailView productId={id} />
    </MainLayout>
  );
}

