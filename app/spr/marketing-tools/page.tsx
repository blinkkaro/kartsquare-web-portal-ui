import React from "react";
import { pageTab } from "@/lib/seo/buildMetadata";
import MarketingToolsLanding from "@/components/marketing-tools/MarketingToolsLanding";

export const metadata = pageTab(
  "Marketing tools",
  "Create campaigns, manage email marketing, and grow your audience as a KartSquare service provider.",
);


export default function ProviderMarketingToolsPage() {
  return <MarketingToolsLanding role="spr" />;
}
