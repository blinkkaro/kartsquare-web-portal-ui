import React from "react";
import { Metadata } from "next";
import MainLayout from "@/app/mainLayout";
import ReelsView from "@/components/pages/reels";

export const metadata: Metadata = {
    title: "Reels | kartsquare Portal",
}

function ReelsPage() {
  return <MainLayout>
    <ReelsView />
  </MainLayout>;
}

export default ReelsPage;
