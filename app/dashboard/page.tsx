import React from "react";
import MainLayout from "../mainLayout";
import DashboardView from "@/components/pages/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Kartsquare Portal",
  description: "Service Provider Dashboard",
};

export default function DashboardPage() {
  return (
    <MainLayout>
      <DashboardView />
    </MainLayout>
  );
}
