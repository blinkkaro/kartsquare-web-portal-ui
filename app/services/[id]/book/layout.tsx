import type { Metadata } from "next";
import type { ReactNode } from "react";
import { seoPrivate } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = seoPrivate({
  title: "Book a service",
  description:
    "Complete your kartsquare service booking — choose time, address, and payment options.",
});

export default function ServiceBookLayout({ children }: { children: ReactNode }) {
  return children;
}
