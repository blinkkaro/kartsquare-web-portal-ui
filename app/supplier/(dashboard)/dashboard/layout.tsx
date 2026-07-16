import type { Metadata } from "next";
import type { ReactNode } from "react";
import { seoPrivate } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = seoPrivate({
  title: "Supplier dashboard",
  description:
    "Overview of your KartSquare supplier store — orders, products, enquiries, and performance at a glance.",
});

export default function SupplierDashboardPageLayout({ children }: { children: ReactNode }) {
  return children;
}
