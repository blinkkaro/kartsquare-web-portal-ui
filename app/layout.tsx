import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Providers } from "./providers";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kartsquare.com";

/** Viewport — must be exported separately from metadata in Next.js 14+ */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#172023" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "KartSquare",
  appleWebApp: {
    capable: true,
    title: "KartSquare",
    statusBarStyle: "default",
  },
  // ICO: only `app/favicon.ico` (Next injects one <link>). Do not repeat favicon.ico here or in
  // manifest — auditors flag multiple ICO declarations.
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
      "max-image-preview": "large",
      "max-snippet": -1,
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
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "KartSquare – India's B2B Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kartsquare",
    creator: "@kartsquare",
    title: "KartSquare – B2B Marketplace",
    description: "Products & services from verified suppliers. Buy and book online.",
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
    // Establish hreflang for India locale — signals to Google this is English content for IN.
    languages: {
      "en-IN": SITE_URL,
    },
  },
  category: "marketplace",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KartSquare",
  url: SITE_URL,
  // /icon.png (192×192) is the verified PWA icon present in /public
  logo: `${SITE_URL}/icon.png`,
  description: "B2B marketplace for products and services from verified suppliers.",
  // sameAs: Add social profiles to boost entity recognition in Google's Knowledge Graph.
  // Add or remove handles as your actual social presence dictates.
  sameAs: [
    "https://twitter.com/kartsquare",
    "https://www.linkedin.com/company/kartsquare",
    "https://www.instagram.com/kartsquare",
  ],
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
        {/* Plain script avoids Turbopack chunk split issues from next/script in RootLayout */}
        <script
          async
          src="https://t.contentsquare.net/uxa/c3689fc1ad6ad.js"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: SITE_URL,
                },
              ],
            }),
          }}
        />
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
