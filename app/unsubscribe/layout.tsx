import type { Metadata } from "next";
import type { ReactNode } from "react";
import { seoAuth } from "@/lib/seo/buildMetadata";

export const metadata: Metadata = seoAuth({
  title: "Email unsubscribe",
  description:
    "Unsubscribe from kartsquare marketing emails. Your account and bookings are not affected.",
});

export default function UnsubscribeLayout({ children }: { children: ReactNode }) {
  return children;
}
