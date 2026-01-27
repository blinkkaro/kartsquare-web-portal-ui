import MainLayout from "@/app/mainLayout";
import StoreView from "@/components/pages/store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store | KartSquare Portal",
  description: "KartSquare Store - Find quality products from verified suppliers across India. Browse electronics, machinery, textiles, chemicals, automotive parts and more.",
};

export default function StorePage() {
  return (
    <MainLayout>
      <StoreView />
    </MainLayout>
  );
}
