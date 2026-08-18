import type { Metadata } from "next";
import type { ReactNode } from "react";
import { seoPrivate } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = seoPrivate({
  title: "Edit product",
  description:
    "Update product details, images, pricing, and inventory for your kartsquare supplier listing.",
});

export default function EditProductLayout({ children }: { children: ReactNode }) {
  return children;
}
