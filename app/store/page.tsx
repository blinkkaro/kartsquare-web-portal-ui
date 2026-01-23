import MainLayout from "@/app/mainLayout";
import StoreView from "@/components/pages/store";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store | KartSquare Portal",
  description: "KartSquare Store - Coming Soon",
};

export default function StorePage() {
  return (
    <MainLayout>
      <StoreView />
    </MainLayout>
  );
}
