import MainLayout from "@/app/mainLayout";
import AboutUsView from "@/components/pages/aboutUs";
import { seoPublic, SITE_URL } from "@/lib/seo/buildMetadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumbs";

export const metadata = seoPublic({
  title: "About kartsquare — India's Marketplace for Local Services",
  description:
    "kartsquare was founded in Jaipur to connect verified local service providers with millions of customers across India. Learn our story, mission, and values.",
  path: "/about-us",
  keywords: [
    "about kartsquare",
    "kartsquare Jaipur",
    "kartsquare story",
    "service marketplace India",
    "kartsquare mission",
  ],
});

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About kartsquare",
  url: `${SITE_URL}/about-us`,
  about: {
    "@type": "Organization",
    name: "kartsquare",
    url: SITE_URL,
    foundingDate: "2022",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
  },
};

export default function AboutUs() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "About Us", item: "/about-us" },
  ]);

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <AboutUsView />
    </MainLayout>
  );
}
