import type { Metadata } from "next";
import type { ReactNode } from "react";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = seoAuth({
  title: "Supplier onboarding",
  description:
    "Complete store setup and KYC steps to start selling on kartsquare as a verified supplier.",
});

export default function SupplierOnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
