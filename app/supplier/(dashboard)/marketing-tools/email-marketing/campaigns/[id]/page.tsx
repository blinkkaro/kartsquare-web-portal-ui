import React from "react";
import { pageTab } from "@/lib/seo/buildMetadata";
import CampaignDetails from "@/components/marketing-tools/email-marketing/CampaignDetails";

export const metadata = pageTab(
  "Campaign details",
  "Review performance stats, click rates, and subscriber activity for this supplier email campaign.",
);



export default function SupplierCampaignDetailsPage() {
  return <CampaignDetails role="supplier" />;
}
