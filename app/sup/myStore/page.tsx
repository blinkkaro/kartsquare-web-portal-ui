import MainLayout from "@/app/mainLayout";
import MyStoreView from "@/components/pages/myStore";
import { pageTab } from "@/lib/seo/buildMetadata";
import React from "react";

export const metadata = pageTab(
  "My store",
  "Manage your supplier storefront, branding, and catalogue visibility on KartSquare.",
);

export default function MyStore() {
  return (
    <MainLayout>
      <MyStoreView />
    </MainLayout>
  );
}
