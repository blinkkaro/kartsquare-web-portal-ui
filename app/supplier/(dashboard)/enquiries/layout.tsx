import type { Metadata } from "next";
import type { ReactNode } from "react";
import { seoPrivate } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = seoPrivate({
  title: "Enquiries",
  description:
    "Review and respond to buyer enquiries about your products and services on KartSquare.",
});

export default function SupplierEnquiriesLayout({ children }: { children: ReactNode }) {
  return children;
}
