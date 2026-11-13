import React from "react";
import { pageTab } from "@/lib/seo/buildMetadata";
import CreateCampaign from "@/components/marketing-tools/email-marketing/CreateCampaign";

export const metadata = pageTab(
  "Create campaign",
  "Build and launch a new email campaign to reach your subscribers from your kartsquare supplier account.",
);



export default function SupplierCreateCampaignPage() {
  return <CreateCampaign role="supplier" />;
}
