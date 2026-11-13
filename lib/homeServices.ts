import type { Category } from "@/services/serviceList/listInteraface";

/**
 * Which categories and services the home page puts forward. Everything here is worked out from the
 * live services list, so a category with no providers behind it never appears, and nothing is invented.
 */

/** A service type needs at least this many live services to be listed (unless it is a winter or popular service). */
export const MIN_SERVICES_FOR_HOME = 2;

/**
 * Sub-categories people look for in the cold months: geyser and heater repair, electricians, inverters
 * and batteries for winter power cuts, and plumbers for pipes and bathrooms. Matched against the real
 * sub-category names, so it only ever promotes services that exist.
 */
export const WINTER_SERVICE = /electric|geyser|water heater|heater|inverter|battery|plumb/i;

/** The few fields of a live service the ranking reads. The API sends the ids and names as arrays. */
export interface HomeServiceInput {
  category_id?: string | string[] | null;
  sub_category_name?: string[] | string | null;
}

const toArray = (value: string | string[] | null | undefined): string[] =>
  Array.isArray(value) ? value : value ? [value] : [];

/** How many live services each category has. */
export function countServicesByCategory(services: HomeServiceInput[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const s of services) {
    for (const id of new Set(toArray(s.category_id))) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

/**
 * The home page's popular categories, in the order they are shown. Each entry is matched against the
 * real category names, so renaming or removing one in the backend simply drops it from the page.
 *   Home Services (electrician, geyser repair, plumber, painter), Security Services (CCTV),
 *   Religious & Spiritual (astrologer), Photography & Videography, Energy & Environment (inverter, battery).
 */
export const POPULAR_HOME_CATEGORIES: RegExp[] = [/home\s*serv/i, /security/i, /religious|spiritual/i, /photograph/i, /energy/i];

/** Service types we name on the home page even when a city has only one provider for them. */
export const POPULAR_SERVICE = /cctv|painter|astrolog|photograph|portrait/i;

/**
 * The popular categories to show: the curated list above, in order, keeping only those that have at least
 * one live service. Capped at `max` (5). An empty result means there is nothing to show, never a fallback list.
 */
export function popularHomeCategories<T extends Pick<Category, "id" | "name" | "is_deleted">>(
  categories: T[] | undefined | null,
  services: HomeServiceInput[] | undefined | null,
  max = 5,
): T[] {
  const counts = countServicesByCategory(services ?? []);
  return pickPopular(categories, (id) => (counts.get(id) ?? 0) >= 1, max);
}

/** A category's availability at a place, as GET /locations/:city/categories?view=availability returns it. */
export interface CategoryAvailabilityInput {
  id: string;
  service_count: number;
}

/**
 * Same curated list, but "has a live service" comes from the backend's availability counts for the
 * city/locality (the exact eligibility the listing uses), not from a page of services.
 */
export function popularHomeCategoriesFromAvailability<T extends Pick<Category, "id" | "name" | "is_deleted">>(
  categories: T[] | undefined | null,
  availability: CategoryAvailabilityInput[] | undefined | null,
  max = 5,
): T[] {
  const live = new Set((availability ?? []).filter((a) => a.service_count >= 1).map((a) => a.id));
  return pickPopular(categories, (id) => live.has(id), max);
}

function pickPopular<T extends Pick<Category, "id" | "name" | "is_deleted">>(
  categories: T[] | undefined | null,
  isLive: (id: string) => boolean,
  max: number,
): T[] {
  const live = (categories ?? []).filter((c) => !c.is_deleted && isLive(c.id));
  const picked: T[] = [];
  for (const pattern of POPULAR_HOME_CATEGORIES) {
    const match = live.find((c) => pattern.test(c.name) && !picked.includes(c));
    if (match) picked.push(match);
    if (picked.length === max) break;
  }
  return picked;
}

function countServiceTypes(services: HomeServiceInput[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const s of services) {
    for (const name of new Set(toArray(s.sub_category_name).map((n) => n.trim()).filter(Boolean))) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return counts;
}

const byCountThenName = (counts: Map<string, number>) => (a: string, b: string) =>
  (counts.get(b) ?? 0) - (counts.get(a) ?? 0) || a.localeCompare(b);

/** Up to `max` winter service types we actually have, most providers first. Used for the hero shortcuts. */
export function winterServiceNames(services: HomeServiceInput[] | undefined | null, max = 3): string[] {
  const counts = countServiceTypes(services ?? []);
  return [...counts.keys()].filter((n) => WINTER_SERVICE.test(n)).sort(byCountThenName(counts)).slice(0, max);
}

/**
 * Service types for the "popular in your city" list: every winter service we have, then the popular ones
 * (CCTV, painter, astrologer, photography...), then any other type with at least `min` live services.
 * Capped at `max`.
 */
export function homeServiceNames(services: HomeServiceInput[] | undefined | null, max = 8, min = MIN_SERVICES_FOR_HOME): string[] {
  const counts = countServiceTypes(services ?? []);
  const names = [...counts.keys()];
  const winter = names.filter((n) => WINTER_SERVICE.test(n)).sort(byCountThenName(counts));
  const popular = names.filter((n) => !WINTER_SERVICE.test(n) && POPULAR_SERVICE.test(n)).sort(byCountThenName(counts));
  const others = names
    .filter((n) => !WINTER_SERVICE.test(n) && !POPULAR_SERVICE.test(n) && (counts.get(n) ?? 0) >= min)
    .sort(byCountThenName(counts));
  return [...winter, ...popular, ...others].slice(0, max);
}
