import MainLayout from "@/app/mainLayout";
import StoreInfoView from "@/components/pages/storeInfo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store Info | kartsquare Portal",
  description: "View and edit your Store information",
};

export default function StoreInfo() {
  return (
    <MainLayout>
      <StoreInfoView />
    </MainLayout>
  );
}
