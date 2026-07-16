import type { Metadata } from "next";
import type { ReactNode } from "react";
import { seoPrivate } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = seoPrivate({
  title: "Settings",
  description:
    "Update your business profile, KYC details, and bank information for your KartSquare supplier account.",
});

export default function SupplierSettingsLayout({ children }: { children: ReactNode }) {
  return children;
}
