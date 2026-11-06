/**
 * Location reads for the browser.
 *
 * Goes through the shared Axios client (`services/api.ts`), so requests reach
 * NEXT_PUBLIC_API_URL instead of the Next.js server. `locationService.ts` is
 * the server-rendering counterpart (plain fetch + ISR).
 */
import { GET } from "@/services/api";
import type { PublicLocation, SiblingCount } from "./locationService";

interface ApiEnvelope<T> {
  data?: T;
}

export interface ResolvedPlace {
  resolved: boolean;
  location: PublicLocation | null;
  city?: PublicLocation | null;
  distance_km?: number | null;
  canonical_path?: string;
}

async function getData<T>(path: string, params: object = {}): Promise<T | null> {
  try {
    // The shared client's response interceptor already returns the body
    // ({ status, data }), not the Axios response.
    const body = (await GET<ApiEnvelope<T>>(path, params, false)) as unknown as ApiEnvelope<T>;
    return body?.data ?? null;
  } catch {
    return null;
  }
}

/** A map pin or GPS fix -> the nearest known area and city (null if none near). */
export async function resolveCoords(
  latitude: number,
  longitude: number,
): Promise<ResolvedPlace | null> {
  const data = await getData<ResolvedPlace>("/locations/resolve", {
    lat: latitude,
    lng: longitude,
  });
  return data?.resolved ? data : null;
}

/** Typed text (area, city, pincode) -> a known place with its centre point. */
export async function resolveText(q: string): Promise<ResolvedPlace | null> {
  const query = q.trim();
  if (!query) return null;
  const data = await getData<ResolvedPlace>("/locations/resolve", { q: query });
  return data?.resolved ? data : null;
}

/** Cities that are live (have supply) — suggestions, never a default. */
export async function listActiveCities(limit = 12): Promise<PublicLocation[]> {
  const data = await getData<{ locations: PublicLocation[] }>("/locations", {
    kind: "city",
    active: "true",
    limit,
  });
  return data?.locations ?? [];
}

/** Areas of one city, with how many services each has. */
export async function listLocalities(citySlug: string): Promise<SiblingCount[]> {
  if (!citySlug) return [];
  const data = await getData<{ localities: SiblingCount[] }>(
    `/locations/${encodeURIComponent(citySlug)}/localities`,
  );
  return data?.localities ?? [];
}

export interface AreaCount {
  id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  /** Exactly the number of services GET /services returns at this area's centre with the same filters. */
  total: number;
}

/**
 * Areas of a city with live counts. Pass the same content filters the list
 * uses (category, search) so each number matches the results behind it.
 */
export async function listAreaCounts(
  citySlug: string,
  filters: { category_id?: string; search?: string } = {},
): Promise<AreaCount[]> {
  if (!citySlug) return [];
  const params: Record<string, string> = {};
  if (filters.category_id) params.category_id = filters.category_id;
  if (filters.search?.trim()) params.search = filters.search.trim();
  const data = await getData<{ areas: AreaCount[] }>(
    `/locations/${encodeURIComponent(citySlug)}/area-counts`,
    params,
  );
  return data?.areas ?? [];
}

export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
