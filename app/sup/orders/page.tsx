import MainLayout from "@/app/mainLayout";
import SupplierOrderView from "@/components/pages/supplierOrder";
import { Metadata } from "next";
import React from "react";

const metadata: Metadata = {
  title: "Orders | KartSquare",
  description: "Supplier Orders",
};

function Orders() {
  return (
    <MainLayout>
      <SupplierOrderView />
    </MainLayout>
  );
}

export default Orders;
