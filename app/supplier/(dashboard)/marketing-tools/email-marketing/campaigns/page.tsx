import React from "react";
import { pageTab } from "@/lib/seo/buildMetadata";
import CampaignList from "@/components/marketing-tools/email-marketing/CampaignList";

export const metadata = pageTab(
  "Campaigns",
  "View and manage all email campaigns for your KartSquare supplier store.",
);



export default function SupplierCampaignListPage() {
  return <CampaignList role="supplier" />;
}
