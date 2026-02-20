import MainLayout from "@/app/mainLayout";
import ProductsListingView from "@/components/pages/store/ProductsListing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | KartSquare Store",
  description: "Browse products from verified suppliers across India",
};

export default function ProductsListingPage() {
  return (
    <MainLayout>
      <ProductsListingView />
    </MainLayout>
  );
}
