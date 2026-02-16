import MainLayout from "@/app/mainLayout";
import React from "react";
import ManageProductView from "@/components/pages/manageProduct";

export const metadata = {
  title: "Manage Product|KartSquare",
  description: "Add new product and manage existing products",
};

export default async function ManageProduct({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;
  return (
    <MainLayout>
      <ManageProductView productId={id} />
    </MainLayout>
  );
}
