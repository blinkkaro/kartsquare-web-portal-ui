import React from "react";
import AdvertiseView from "@/components/pages/advertise";
import { Metadata } from "next";
import MainLayout from "@/app/mainLayout";

export const metadata: Metadata = {
  title: "Advertise | KartSquare",
  description:
    "Add your brand to KartSquare and reach thousands of customers use Ads to promote your brand",
};

function Advertise() {
  return (
    <MainLayout>
      <AdvertiseView />
    </MainLayout>
  );
}

export default Advertise;
