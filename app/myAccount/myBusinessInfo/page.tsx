import React from "react";
import MyBusinessInfoView from "@/components/pages/myBusinessInfo";
import { Metadata } from "next";
import MainLayout from "@/app/mainLayout";

export const metadata: Metadata = {
  title: "My Business Info",
  description: "My Business Info",
};

function MyBusinessInfoPage() {
  return (
    <MainLayout>
      <MyBusinessInfoView />
    </MainLayout>
  );
}

export default MyBusinessInfoPage;
