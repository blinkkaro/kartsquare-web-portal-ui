import React from "react";
import { pageTab } from "@/lib/seo/buildMetadata";
import MarketingToolsLanding from "@/components/marketing-tools/MarketingToolsLanding";

export const metadata = pageTab(
  "Marketing tools",
  "Create campaigns, manage email marketing, and grow your customer base from the kartsquare supplier dashboard.",
);



export default function SupplierMarketingToolsPage() {
  return <MarketingToolsLanding role="supplier" />;
}
