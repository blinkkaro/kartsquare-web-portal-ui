import type { Metadata } from "next";
import type { ReactNode } from "react";
import { seoPrivate } from "@/lib/seo/buildMetadata";
import SupplierDashboardClientLayout from "./SupplierDashboardClientLayout";

export const metadata: Metadata = seoPrivate({
  title: "Supplier dashboard",
  description:
    "Manage your KartSquare supplier store, products, orders, and marketing tools.",
});

export default function SupplierDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SupplierDashboardClientLayout>{children}</SupplierDashboardClientLayout>;
}
