import React from "react";
import MainLayout from "../mainLayout";
import DashboardView from "@/components/pages/dashboard";
import { seoPrivate } from "@/lib/seo/buildMetadata";

export const metadata = seoPrivate({
  title: "Service provider dashboard",
  description:
    "Manage your services, leads and bookings on Kartsquare.",
});

export default function Dashboard() {
  return (
    <MainLayout>
      <DashboardView />
    </MainLayout>
  );
}
