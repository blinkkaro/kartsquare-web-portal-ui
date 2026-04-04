import React from "react";
import MainLayout from "../mainLayout";
import DashboardView from "@/components/pages/dashboard";
import { seoPrivate } from "@/lib/seo/buildMetadata";

export const metadata = seoPrivate({
  title: "Service provider dashboard",
  description:
    "Overview of your KartSquare bookings, earnings, services, and performance as a verified provider.",
});

export default function Dashboard() {
  return (
    <MainLayout>
      <DashboardView />
    </MainLayout>
  );
}
