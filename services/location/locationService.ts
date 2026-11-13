/**
 * Location routing reads, for server components.
 *
 * Plain `fetch` with `next.revalidate` rather than the Axios client in
 * `services/api.ts`: these run during server rendering and ISR, where the
 * Axios interceptors (token injection, 401 refresh queue) have no browser to
 * work with. Same pattern as `lib/seo/sitePageSeo.ts`.
 */
import type { Service } from "@/services/serviceList/listInteraface";

const API_BASE = process.env.NEXT_PUBLIC_API_URL as string;

/** Listing pages change when supply changes — hourly is plenty. */
const LISTING_REVALIDATE_SECONDS = 3600;
const LOCATIONS_REVALIDATE_SECONDS = 86400;

export type LocationKind = "state" | "city" | "locality";

export interface PublicLocation {
  id: string;
  kind: LocationKind;
  name: string;
  slug: string;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  city: { name: string | null; slug: string | null };
}

export interface LocationFallback {
  from: LocationKind;
  to: LocationKind;
  reason: "locality_unknown" | "locality_thin" | "city_thin";
  requested: string | null;
}

export interface SiblingCount {
  id: string;
  name: string;
  slug: string;
  total: number;
}

export interface ListingSeo {
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
}

export interface LocationListing {
  location: PublicLocation;
  city: PublicLocation;
  category: { id: string; name: string; slug: string };
  sub_category: { id: string; name: string; slug: string | null } | null;
  services: Service[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  seo: ListingSeo | null;
  canonical_path: string;
  indexable: boolean;
  fallback: LocationFallback | null;
  threshold: { min_services: number; page_total: number };
  siblings: { localities: SiblingCount[]; nearby_cities: SiblingCount[] };
}

async function getJson<T>(
  path: string,
  revalidate: number,
): Promise<T | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T };
    return json?.data ?? null;
  } catch {
    // A listing page renders a 404 rather than a stack trace when the API is
    // unreachable; the caller decides.
    return null;
  }
}

export interface ListingArgs {
  citySlug: string;
  localitySlug?: string;
  categorySlug: string;
  subCategorySlug?: string;
  page?: number;
}

export async function getLocationListing(
  args: ListingArgs,
): Promise<LocationListing | null> {
  const segments = [args.citySlug];
  if (args.localitySlug) segments.push(args.localitySlug);
  segments.push(args.categorySlug);

  const query = new URLSearchParams();
  if (args.page && args.page > 1) query.set("page", String(args.page));
  if (args.subCategorySlug) query.set("sub_category_slug", args.subCategorySlug);
  const qs = query.toString();

  return getJson<LocationListing>(
    `/locations/${segments.map(encodeURIComponent).join("/")}/listing${qs ? `?${qs}` : ""}`,
    LISTING_REVALIDATE_SECONDS,
  );
}

export async function getActiveCities(): Promise<PublicLocation[]> {
  const data = await getJson<{ locations: PublicLocation[] }>(
    "/locations?kind=city&active=true",
    LOCATIONS_REVALIDATE_SECONDS,
  );
  return data?.locations ?? [];
}

export async function getCityCategories(
  citySlug: string,
): Promise<{ city: PublicLocation; categories: SiblingCount[] } | null> {
  return getJson(
    `/locations/${encodeURIComponent(citySlug)}/categories`,
    LISTING_REVALIDATE_SECONDS,
  );
}

export interface SitemapUrl {
  path: string;
  lastmod: string | null;
  service_count: number;
}

export async function getLocationSitemapUrls(): Promise<SitemapUrl[]> {
  const data = await getJson<{ urls: SitemapUrl[]; enabled: boolean }>(
    "/locations/sitemap",
    LISTING_REVALIDATE_SECONDS,
  );
  return data?.enabled ? (data.urls ?? []) : [];
}
