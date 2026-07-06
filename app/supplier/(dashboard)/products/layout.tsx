import type { Metadata } from "next";
import type { ReactNode } from "react";
import { seoPrivate } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = seoPrivate({
  title: "Products",
  description:
    "Manage your product listings, pricing, stock, and images from your KartSquare supplier store.",
});

export default function SupplierProductsLayout({ children }: { children: ReactNode }) {
  return children;
}
