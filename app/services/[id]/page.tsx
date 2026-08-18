import type { Metadata } from "next";
import CustomerServiceDetails from "../../../components/pages/customer/serviceDetails";
import { serviceListService } from "@/services/serviceList/serviceListService";
import { SITE_URL } from "@/lib/seo/buildMetadata";
import { buildBreadcrumbJsonLd, BREADCRUMBS } from "@/lib/seo/breadcrumbs";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function parseStructured(raw: unknown): Record<string, unknown> | null {
  if (!raw) return null;
  if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === "string") {
    try {
      const o = JSON.parse(raw) as unknown;
      if (typeof o === "object" && o !== null) return o as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const base = SITE_URL;

  try {
    const service = await serviceListService.getServiceById(id);
    const path = `/services/${service.slug || service.service_id || id}`;
    const canonical = `${base}${path}`;
    
    // Dynamic branded & localized title: "Service in City by Business | kartsquare"
    const serviceName = service.service_name || "Service";
    const bizName = service.business_name || service.provider_name;
    const city = service.service_address?.city_town;
    
    let titleText = service.meta_title;
    if (!titleText) {
      if (bizName && city) {
        titleText = `${serviceName} in ${city} by ${bizName} | kartsquare`;
      } else if (bizName) {
        titleText = `${serviceName} by ${bizName} | kartsquare`;
      } else {
        titleText = `${serviceName} | kartsquare`;
      }
    }

    const desc =
      service.meta_description ||
      service.service_desc ||
      `Book ${serviceName}${city ? ` in ${city}` : ""} by ${bizName || "verified providers"} on kartsquare. Enjoy professional services with clear pricing and secure booking.`;
    
    const ogTitle =
      service.og_title || titleText;
    const ogDesc =
      service.og_description || desc;
    const images = service.og_image
      ? [service.og_image]
      : service.image_urls?.length
        ? service.image_urls
        : [];

    return {
      title: { absolute: titleText },
      description: desc.slice(0, 160),
      keywords: service.meta_keywords
        ? service.meta_keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : undefined,
      alternates: { canonical },
      openGraph: {
        title: ogTitle,
        description: ogDesc.slice(0, 200),
        url: canonical,
        siteName: "kartsquare",
        type: "website",
        locale: "en_IN",
        ...(images.length ? { images: images.map((url) => ({ url })) } : {}),
      },
      twitter: {
        card: images.length ? "summary_large_image" : "summary",
        title: ogTitle,
        description: ogDesc.slice(0, 200),
        ...(images.length ? { images } : {}),
      },
      robots: { index: true, follow: true },
    };
  } catch {
    return {
      title: { absolute: "Service details | kartsquare" },
      description:
        "Browse and book professional services from verified providers on kartsquare.",
      robots: { index: false, follow: true },
    };
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let jsonLd: string | null = null;
  try {
    const service = await serviceListService.getServiceById(id);
    const structured = parseStructured(service.structured_data);
    const canonical = `${SITE_URL}/services/${service.slug || service.service_id || id}`;
    
    // Build MNC-level rich snippet data
    const node = structured
      ? { 
          ...structured, 
          url: canonical, 
          "@context": structured["@context"] || "https://schema.org" 
        }
      : {
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.service_name,
          description: service.service_desc || service.meta_description,
          url: canonical,
          provider: {
            "@type": "LocalBusiness",
            name: service.business_name || service.provider_name,
            image: service.provider_image_url || undefined,
            address: service.service_address ? {
              "@type": "PostalAddress",
              streetAddress: service.service_address.address,
              addressLocality: service.service_address.city_town,
              addressRegion: service.service_address.state,
              postalCode: service.service_address.pincode,
              addressCountry: service.service_address.country,
            } : undefined,
          },
          ...(service.avg_service_rating > 0 ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: service.avg_service_rating,
              reviewCount: service.review_count || 1,
              bestRating: "5",
              worstRating: "1",
            }
          } : {}),
        };
    jsonLd = JSON.stringify(node);

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      ...BREADCRUMBS.SERVICES,
      {
        name: service.service_name || "Service",
        item: `/services/${service.slug || service.service_id || id}`,
      },
    ]);

    return (
      <>
        {jsonLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd }}
          />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
        />
        <CustomerServiceDetails />
      </>
    );
  } catch {
    jsonLd = null;
    return <CustomerServiceDetails />;
  }
}
