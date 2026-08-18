import React from "react";
import type { Metadata } from "next";
import MainLayout from "@/app/mainLayout";
import { pageTab } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = pageTab(
  "Marketing tools",
  "Email marketing and campaigns to grow your kartsquare service business.",
);

export default function SprMarketingToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
