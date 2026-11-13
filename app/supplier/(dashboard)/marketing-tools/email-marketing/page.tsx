import React from "react";
import { pageTab } from "@/lib/seo/buildMetadata";
import DashboardOverview from "@/components/marketing-tools/email-marketing/DashboardOverview";

export const metadata = pageTab(
  "Email marketing",
  "Overview of your email marketing performance — opens, clicks, and subscriber stats for your supplier store.",
);



export default function SupplierEmailMarketingPage() {
  return <DashboardOverview role="supplier" />;
}
