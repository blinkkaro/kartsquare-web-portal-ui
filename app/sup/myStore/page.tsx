import MainLayout from "@/app/mainLayout";
import MyStoreView from "@/components/pages/myStore";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "My Store | KartSquare",
  description: "My Store add your products to get more customers",
};

function MyStore() {
  return (
    <MainLayout>
      <MyStoreView />
    </MainLayout>
  );
}

export default MyStore;
