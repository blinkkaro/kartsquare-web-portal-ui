import MainLayout from "@/app/mainLayout";
import SupplierOrderView from "@/components/pages/supplierOrder";
import { pageTab } from "@/lib/seo/buildMetadata";
import React from "react";

export const metadata = pageTab(
  "Supplier orders",
  "Track and fulfil orders from your KartSquare storefront.",
);

export default function Orders() {
  return (
    <MainLayout>
      <SupplierOrderView />
    </MainLayout>
  );
}
