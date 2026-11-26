import { getCityCategories, getLocationListing } from "@/services/location/locationService";
import type { Service } from "@/services/serviceList/listInteraface";

/** The one city with live coverage today. Pages link into it only when the API confirms providers. */
export const COVERAGE_CITY = { slug: "jaipur", name: "Jaipur" } as const;

/** category slug -> number of live services in the city, from the API. Empty if the API is down. */
export async function getCityCoverage(): Promise<Record<string, number>> {
  const data = await getCityCategories(COVERAGE_CITY.slug);
  const out: Record<string, number> = {};
  for (const c of data?.categories ?? []) if (c.total > 0) out[c.slug] = c.total;
  return out;
}

/** Up to `limit` live services for a category in the coverage city. Empty if none or the API is down. */
export async function getCategoryProviders(categorySlug: string, limit = 6): Promise<Service[]> {
  const listing = await getLocationListing({ citySlug: COVERAGE_CITY.slug, categorySlug });
  return (listing?.services ?? []).slice(0, limit);
}

/** Icon, colour and photo the home page already shows for a category. */
export interface CategoryMedia {
  icon: string | null;
  color: string | null;
  image: string | null;
}

/** category slug -> media, from the public categories endpoint. Empty if the API is down: pages fall back to a plain icon tile. */
export async function getCategoryMedia(): Promise<Record<string, CategoryMedia>> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return {};
  try {
    const res = await fetch(`${base}/categories`, { next: { revalidate: 3600 }, headers: { Accept: "application/json" } });
    if (!res.ok) return {};
    const json = (await res.json()) as { data?: unknown };
    const raw = json.data as { categories?: unknown[] } | unknown[] | undefined;
    const list = (Array.isArray(raw) ? raw : raw?.categories ?? []) as Array<Record<string, unknown>>;
    const out: Record<string, CategoryMedia> = {};
    for (const c of list) {
      if (typeof c.slug !== "string") continue;
      out[c.slug] = {
        icon: typeof c.icon === "string" ? c.icon : null,
        color: typeof c.color === "string" ? c.color : null,
        image: typeof c.image === "string" ? c.image : null,
      };
    }
    return out;
  } catch {
    return {};
  }
}

/** True when a listing names one of `terms` as a whole word in its name, sub-category or description. */
export function serviceMatches(s: Service, terms: string[]): boolean {
  const hay = [s.service_name, ...(s.sub_category_name ?? []), s.service_desc ?? ""].join(" ").toLowerCase();
  return terms.some((t) => new RegExp(`\\b${t.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(hay));
}

/**
 * Live services in the coverage city whose listing mentions one of `terms`. Only what providers wrote
 * about themselves is matched, so a listing never appears under a service it does not name.
 */
export async function getSubServiceProviders(categorySlug: string, terms: string[], limit = 6): Promise<Service[]> {
  const listing = await getLocationListing({ citySlug: COVERAGE_CITY.slug, categorySlug });
  return (listing?.services ?? []).filter((s) => serviceMatches(s, terms)).slice(0, limit);
}
