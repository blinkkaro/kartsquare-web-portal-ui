/**
 * 404 Not Found — Server Component
 *
 * Must be a SERVER component so Next.js can export `metadata` and Googlebot
 * can read the page title / description on 404 responses.
 * Interactive parts are delegated to NotFoundClient (client component).
 */
import type { Metadata } from "next";
import NotFoundClient from "./not-found-client";

export const metadata: Metadata = {
  title: { absolute: "404 — Page Not Found | KartSquare" },
  description:
    "The page you are looking for does not exist. Return to KartSquare's homepage to browse products, services, and verified suppliers.",
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function NotFound() {
  return <NotFoundClient />;
}
