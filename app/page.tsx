import type { Metadata } from "next";
import MainLayout from "./mainLayout";
import HomeView from "@/components/pages/home";
import { seoPublic, SITE_URL } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";

const HOME_TITLE = "Local Services in Jaipur: AC, Plumber, Electrician";
const HOME_DESCRIPTION =
  "Find approved local pros in Jaipur: AC repair, plumbers, electricians, photographers & more. Search in English, Hindi or Hinglish and contact providers directly.";

// Jaipur-first fallback. If admin-managed SEO exists for the "home" page key it wins
// (see sitePageSeoOrFallback); the geo tags below are added either way.
const homeFallback = seoPublic({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  keywords: [
    "local services in Jaipur",
    "AC repair Jaipur",
    "plumber in Jaipur",
    "electrician in Jaipur",
    "photographer in Jaipur",
    "home services Jaipur",
    "book local services online",
    "kartsquare",
  ],
});

/** Jaipur city centre. Geo meta helps local/regional search and geo-aware AI answers. */
const GEO = {
  "geo.region": "IN-RJ",
  "geo.placename": "Jaipur",
  "geo.position": "26.9124;75.7873",
  ICBM: "26.9124, 75.7873",
};

export async function generateMetadata(): Promise<Metadata> {
  const md = await sitePageSeoOrFallback("home", homeFallback);
  const other: Record<string, string | number | (string | number)[]> = {};
  for (const [k, v] of Object.entries(md.other ?? {})) if (v !== undefined) other[k] = v;
  return { ...md, other: { ...other, ...GEO } };
}

/**
 * Page-level structured data. `speakable` points voice/answer engines at the two
 * on-page elements that state the answer; `spatialCoverage` ties the page to Jaipur.
 * (Organization + WebSite live in the root layout; FAQPage is emitted by the FAQ section.)
 */
const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: HOME_TITLE,
  description: HOME_DESCRIPTION,
  inLanguage: "en-IN",
  isPartOf: { "@type": "WebSite", url: SITE_URL, name: "kartsquare" },
  about: { "@type": "Thing", name: "Local services in Jaipur" },
  spatialCoverage: {
    "@type": "Place",
    name: "Jaipur, Rajasthan, India",
    geo: { "@type": "GeoCoordinates", latitude: 26.9124, longitude: 75.7873 },
  },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["[data-speakable='headline']", "[data-speakable='answer']"],
  },
};

export default function Home() {
  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <HomeView />
    </MainLayout>
  );
}
