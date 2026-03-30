import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Providers } from "./providers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kartsquare.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KartSquare – B2B Marketplace | Products & Services from Verified Suppliers",
    template: "%s | KartSquare",
  },
  description:
    "KartSquare is India's B2B marketplace for products and services. Discover electronics, machinery, textiles, chemicals, automotive parts and professional services from verified suppliers. Buy and book online.",
  keywords: [
    "B2B marketplace",
    "KartSquare",
    "kartsquare",
    "Kart Square",
    "products India",
    "services marketplace",
    "verified suppliers",
    "business products",
    "wholesale",
    "industrial supplies",
    "home services",
    "professional services",
  ],
  authors: [{ name: "KartSquare", url: SITE_URL }],
  creator: "KartSquare",
  publisher: "KartSquare",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "KartSquare",
    title: "KartSquare – B2B Marketplace | Products & Services from Verified Suppliers",
    description:
      "India's B2B marketplace for products and services. Discover and buy from verified suppliers. Book professional services online.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KartSquare – B2B Marketplace",
    description: "Products & services from verified suppliers. Buy and book online.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "marketplace",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KartSquare",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: "B2B marketplace for products and services from verified suppliers.",
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "KartSquare",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Poppins', system-ui, -apple-system, sans-serif" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
