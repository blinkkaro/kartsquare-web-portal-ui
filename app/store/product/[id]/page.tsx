import MainLayout from "@/app/mainLayout";
import ProductDetailsView from "@/components/pages/store/ProductDetailsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details | KartSquare Store",
  description: "View detailed product information from verified suppliers",
};

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <MainLayout>
      <ProductDetailsView productId={id} />
    </MainLayout>
  );
}
