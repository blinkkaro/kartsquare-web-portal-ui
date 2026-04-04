import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = pageTab(
  "Marketing tools",
  "Email marketing and campaigns for your KartSquare supplier store.",
);

export default function SupplierMarketingToolsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
