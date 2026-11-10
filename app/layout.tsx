import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Plus_Jakarta_Sans, Mukta } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Plus Jakarta Sans for Latin; Mukta supplies the matching Devanagari so Hindi
// never falls back to a mismatched system font. Weights kept to 400/600/700.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});
const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-mukta",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kartsquare.com";

/** Viewport — must be exported separately from metadata in Next.js 14+ */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  // Lets the bottom nav pad for the iPhone home indicator via env(safe-area-inset-bottom)
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "kartsquare",
  appleWebApp: {
    capable: true,
    title: "kartsquare",
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
    default: "Kartsquare – Local Services in Jaipur",
    template: "%s | kartsquare",
  },
  description:
    "Find local service providers in Jaipur, see their work and send a request: AC repair, electricians, plumbers, cleaning, beauty and more.",
  keywords: [
    "kartsquare",
    "local services Jaipur",
    "home services",
    "AC repair Jaipur",
    "electrician Jaipur",
    "plumber Jaipur",
    "services marketplace",
    "professional services",
  ],
  authors: [{ name: "kartsquare", url: SITE_URL }],
  creator: "kartsquare",
  publisher: "kartsquare",
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
    siteName: "kartsquare",
    title: "Kartsquare – Local Services in Jaipur",
    description:
      "Find local service providers in Jaipur, see their work and send a request: AC repair, electricians, plumbers, cleaning, beauty and more.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Kartsquare – local services in Jaipur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kartsquare",
    creator: "@kartsquare",
    title: "Kartsquare – Local Services in Jaipur",
    description: "Find local service providers in Jaipur, see their work and send a request: AC repair, electricians, plumbers, cleaning, beauty and more.",
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
  name: "kartsquare",
  url: SITE_URL,
  // /icon.png (192×192) is the PWA icon present in /public
  logo: `${SITE_URL}/icon.png`,
  description: "Find local service providers in Jaipur, see their work and send a request: AC repair, electricians, plumbers, cleaning, beauty and more.",
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
  name: "kartsquare",
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
    <html lang="en" className={`${jakarta.variable} ${mukta.variable}`}>
      <body
        style={{ fontFamily: "var(--font-jakarta), var(--font-mukta), system-ui, -apple-system, sans-serif" }}
        suppressHydrationWarning
      >
        {/* Plain script avoids Turbopack chunk split issues from next/script in RootLayout */}
        <script
          async
          src="https://t.contentsquare.net/uxa/c3689fc1ad6ad.js"
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/* No global BreadcrumbList here — pages that have a real trail (blogs,
            store, services, business listings) emit their own via
            lib/seo/breadcrumbs.ts. A single sitewide "Home"-only entry would
            duplicate/conflict with those page-specific breadcrumbs. */}
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
