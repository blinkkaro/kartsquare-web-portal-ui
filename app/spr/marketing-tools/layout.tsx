import React from "react";
import MainLayout from "@/app/mainLayout";

export default function SprMarketingToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
