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
