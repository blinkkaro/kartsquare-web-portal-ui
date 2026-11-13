import { cache } from "react";

import { SITE_URL } from "./buildMetadata";
import { isCanonicalServicePath } from "./sitemapPaths";
import { fetchPublicJson, getApiBaseUrl, UpstreamError } from "./upstream";

/** Fields of GET /services/:idOrSlug that the SEO layer reads. */
export type ServiceSeo = {
  service_id: string;
  slug?: string | null;
  /** /services/{slug}, built by the backend; null while the service has no slug. */
  canonical_path?: string | null;
  service_name?: string | null;
  service_desc?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  image_urls?: string[] | null;
  currency?: string | null;
  price?: number | null;
  pricing_type?: string | null;
  price_items?: Array<{ service_name?: string; service_desc?: string; price?: number }> | null;
  service_at_location?: string | null;
  business_name?: string | null;
  provider_name?: string | null;
  provider_username?: string | null;
  category_name?: string[] | null;
  sub_category_name?: Array<string | null> | null;
  service_address?: {
    address?: string | null;
    city_town?: string | null;
    state?: string | null;
    pincode?: string | null;
    country?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  } | null;
};

export type ServiceLookup =
  | { kind: "found"; service: ServiceSeo }
  | { kind: "not-found" };

/**
 * One API call per render (React.cache dedupes generateMetadata + page).
 * UpstreamError propagates: an outage is not a missing service.
 */
export const lookupService = cache(async (idOrSlug: string): Promise<ServiceLookup> => {
  const result = await fetchPublicJson<{ data?: ServiceSeo }>(
    `${getApiBaseUrl()}/services/${encodeURIComponent(idOrSlug)}`,
  );
  if (result.status === "not-found") return { kind: "not-found" };
  const service = result.body?.data;
  if (!service || typeof service !== "object" || !service.service_id) {
    throw new UpstreamError("Malformed service payload");
  }
  return { kind: "found", service };
});

/** Query parameters of an enquiry/booking intent that survive a canonical redirect. */
export const PRESERVED_QUERY_KEYS = ["action"] as const;

function firstString(v: string | string[] | undefined): string | null {
  const s = Array.isArray(v) ? v[0] : v;
  return typeof s === "string" && s.length > 0 ? s : null;
}

/**
 * Where a request for `requestedPath` must be permanently redirected, or null
 * when it is already canonical (or the service has no canonical URL). Single hop
 * straight to the API's `canonical_path`, validated as /services/{city}/{slug}.
 */
export function serviceRedirectTarget(
  requestedPath: string,
  service: Pick<ServiceSeo, "canonical_path">,
  searchParams: Record<string, string | string[] | undefined> = {},
): string | null {
  const canonical = service.canonical_path;
  if (!isCanonicalServicePath(canonical)) return null;
  if (canonical === requestedPath) return null;

  const qs = new URLSearchParams();
  for (const key of PRESERVED_QUERY_KEYS) {
    const value = firstString(searchParams[key]);
    if (value) qs.set(key, value);
  }
  const query = qs.toString();
  return query ? `${canonical}?${query}` : canonical;
}

const AT_PROVIDER = new Set(["at_provider", "PROVIDER_LOCATION"]);
const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;
const abs = (u: string) => (/^https?:\/\//i.test(u) ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`);

/**
 * Service JSON-LD from real record fields only. The stored `structured_data`
 * column is AI-generated and is deliberately NOT used. Nothing is invented:
 * a missing address, geo, price or review simply produces no property. There is
 * no `aggregateRating`: the service payload carries no confirmed published-review
 * aggregate (`avg_service_rating` defaults to 4.00).
 */
export function buildServiceJsonLd(service: ServiceSeo, canonicalPath: string): Record<string, unknown> {
  const base = String(SITE_URL).replace(/\/$/, "");
  const url = `${base}${canonicalPath}`;
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    url,
  };
  const name = str(service.service_name);
  if (name) node.name = name;
  const description = str(service.service_desc) ?? str(service.meta_description);
  if (description) node.description = description.slice(0, 2000);
  const images = (service.image_urls ?? []).filter((u): u is string => !!str(u)).map(abs);
  if (images.length) node.image = images;
  const serviceType = (service.sub_category_name ?? []).filter(Boolean).join(", ") || str(service.category_name?.[0]);
  if (serviceType) node.serviceType = serviceType;

  const addr = service.service_address ?? undefined;
  const city = str(addr?.city_town);
  if (city) node.areaServed = { "@type": "Place", name: city };

  const username = str(service.provider_username);
  const providerName = str(service.business_name) ?? str(service.provider_name);
  if (providerName) {
    const provider: Record<string, unknown> = { "@type": "LocalBusiness", name: providerName };
    if (username) {
      const providerUrl = `${base}/in/${encodeURIComponent(username)}`;
      provider["@id"] = `${providerUrl}#provider`;
      provider.url = providerUrl;
    }
    if (addr && AT_PROVIDER.has(String(service.service_at_location))) {
      const postal: Record<string, unknown> = { "@type": "PostalAddress" };
      if (str(addr.address)) postal.streetAddress = str(addr.address);
      if (city) postal.addressLocality = city;
      if (str(addr.state)) postal.addressRegion = str(addr.state);
      if (str(addr.pincode)) postal.postalCode = str(addr.pincode);
      if (str(addr.country)) postal.addressCountry = str(addr.country);
      if (Object.keys(postal).length > 1) provider.address = postal;
      if (typeof addr.latitude === "number" && typeof addr.longitude === "number") {
        provider.geo = { "@type": "GeoCoordinates", latitude: addr.latitude, longitude: addr.longitude };
      }
    }
    node.provider = provider;
  }

  const currency = str(service.currency) ?? "INR";
  const offers: Array<Record<string, unknown>> = [];
  if (service.pricing_type === "multiple" && Array.isArray(service.price_items)) {
    for (const item of service.price_items) {
      if (typeof item?.price === "number" && item.price > 0) {
        offers.push({
          "@type": "Offer",
          ...(str(item.service_name) ? { name: str(item.service_name) } : {}),
          price: item.price,
          priceCurrency: currency,
        });
      }
    }
  } else if (service.pricing_type === "single" && typeof service.price === "number" && service.price > 0) {
    offers.push({ "@type": "Offer", price: service.price, priceCurrency: currency });
  }
  if (offers.length) node.offers = offers.length === 1 ? offers[0] : offers;

  return node;
}
