import React from "react";
import { pageTab } from "@/lib/seo/buildMetadata";
import CampaignList from "@/components/marketing-tools/email-marketing/CampaignList";

export const metadata = pageTab(
  "Campaigns",
  "View and manage all your email campaigns sent through kartsquare marketing tools.",
);



export default function ProviderCampaignListPage() {
  return <CampaignList role="spr" />;
}
