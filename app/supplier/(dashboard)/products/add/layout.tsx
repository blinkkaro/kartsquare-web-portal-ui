import type { Metadata } from "next";
import type { ReactNode } from "react";
import { seoPrivate } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = seoPrivate({
  title: "Add product",
  description:
    "Create a new product listing with images, pricing, and inventory for your kartsquare supplier store.",
});

export default function AddProductLayout({ children }: { children: ReactNode }) {
  return children;
}
