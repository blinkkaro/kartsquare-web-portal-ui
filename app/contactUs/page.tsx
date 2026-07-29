import MainLayout from "@/app/mainLayout";
import ContactUsView from "@/components/pages/contactUs";
import { seoPublic, SITE_URL } from "@/lib/seo/buildMetadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumbs";

export const metadata = seoPublic({
  title: "Contact KartSquare — Support, Partnerships & Enquiries",
  description:
    "Reach the KartSquare team for partnerships, support, press, or marketplace questions. We respond to business and customer enquiries promptly.",
  path: "/contact-us",
  keywords: [
    "KartSquare contact",
    "contact support India",
    "marketplace help",
    "business enquiry",
    "KartSquare helpdesk",
  ],
});

/**
 * ContactPage JSON-LD with the actual phone/email/address shown on the page —
 * gives AI/answer engines a structured NAP to cite instead of only prose.
 */
const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact KartSquare",
  url: `${SITE_URL}/contact-us`,
  about: {
    "@type": "Organization",
    name: "KartSquare",
    url: SITE_URL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-8005673985",
        email: "contact@kartsquare.com",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
  },
};

export default function ContactUs() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Contact Us", item: "/contact-us" },
  ]);

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <ContactUsView />
    </MainLayout>
  );
}
