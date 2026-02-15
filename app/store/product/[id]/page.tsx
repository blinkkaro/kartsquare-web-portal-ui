import MainLayout from "@/app/mainLayout";
import ProductDetailsView from "@/components/pages/store/ProductDetailsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details | KartSquare Store",
  description: "View detailed product information from verified suppliers",
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <MainLayout>
      <ProductDetailsView productId={params.id} />
    </MainLayout>
  );
}
