import React from "react";
import MainLayout from "../mainLayout";
import ListingView from "@/components/pages/leading";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Listing | kartsquare",
  description: "Register your business for free and get listed on kartsquare",
};

function FreeListing() {
  return (
    <MainLayout>
      <ListingView />
    </MainLayout>
  );
}

export default FreeListing;
