import React from "react";
import AddressView from "@/components/pages/address";
import MainLayout from "@/app/mainLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Address | KartSquare Portal",
  description: "List of addresses saved by user",
};

function Address() {
  return (
    <MainLayout>
      <AddressView />
    </MainLayout>
  );
}

export default Address;
