import MainLayout from "@/app/mainLayout";
import React from "react";
import ManageProductView from "@/components/pages/manageProduct";

export const metadata = {
  title: "Manage Product|KartSquare",
  description: "Add new product and manage existing products",
};

const ManageProduct = () => {
  return (
    <MainLayout>
      <ManageProductView />
    </MainLayout>
  );
};

export default ManageProduct;
