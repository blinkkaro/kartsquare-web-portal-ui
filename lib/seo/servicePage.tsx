import type { Metadata } from "next";
import { Suspense } from "react";

import CustomerServiceDetails from "../../components/pages/customer/serviceDetails";
import { BREADCRUMBS, buildBreadcrumbJsonLd } from "./breadcrumbs";
import { SITE_URL } from "./buildMetadata";
import { serializeJsonLd } from "./jsonLd";
import { buildServiceJsonLd, lookupService, type ServiceLookup, type ServiceSeo } from "./serviceSeo";

const NOINDEX: Metadata["robots"] = { index: false, follow: true };

/** Metadata for either service route. Outage => noindex for this render only (the page itself errors). */
export async function serviceMetadata(lookupId: string, legacyPath: string): Promise<Metadata> {
  let lookup: ServiceLookup;
  try {
    lookup = await lookupService(lookupId);
  } catch {
    return {
      title: { absolute: "Service details | kartsquare" },
      description: "Browse and book professional services on kartsquare.",
      robots: NOINDEX,
    };
  }

  if (lookup.kind === "not-found") {
    return {
      title: { absolute: "Service not found | kartsquare" },
      description: "This service could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const service = lookup.service;
  // No canonical city or slug yet: no canonical URL, so keep it out of the index.
  const canonicalPath = service.canonical_path ?? legacyPath;
  const canonical = `${SITE_URL}${canonicalPath}`;
  const indexable = Boolean(service.canonical_path);

  const serviceName = service.service_name || "Service";
  const bizName = service.business_name || service.provider_name;
  const city = service.service_address?.city_town;
  const titleText =
    service.meta_title ||
    (bizName && city
      ? `${serviceName} in ${city} by ${bizName} | kartsquare`
      : bizName
        ? `${serviceName} by ${bizName} | kartsquare`
        : `${serviceName} | kartsquare`);
  const desc =
    service.meta_description ||
    service.service_desc ||
    `Book ${serviceName}${city ? ` in ${city}` : ""} by ${bizName || "providers"} on kartsquare. Clear pricing and secure booking.`;
  const ogTitle = service.og_title || titleText;
  const ogDesc = service.og_description || desc;
  const images = service.og_image ? [service.og_image] : service.image_urls?.length ? service.image_urls : [];

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
    robots: indexable ? { index: true, follow: true } : NOINDEX,
  };
}

/** Body shared by both routes. JSON-LD and breadcrumbs only exist for a canonical URL. */
export function ServiceDetailBody({ service }: { service: ServiceSeo }) {
  const canonicalPath = service.canonical_path;
  const jsonLd = canonicalPath ? serializeJsonLd(buildServiceJsonLd(service, canonicalPath)) : null;
  const breadcrumbJsonLd = canonicalPath
    ? buildBreadcrumbJsonLd([...BREADCRUMBS.SERVICES, { name: service.service_name || "Service", item: canonicalPath }])
    : null;

  return (
    <>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /> : null}
      {breadcrumbJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
      ) : null}
      {/* useSearchParams inside the details view needs a Suspense boundary for static/ISR rendering. */}
      <Suspense fallback={null}>
        <CustomerServiceDetails />
      </Suspense>
    </>
  );
}
