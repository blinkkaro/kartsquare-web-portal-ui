/**
 * Pure helpers for the customer home hero (components/pages/home/sections/NewHeroSection.tsx).
 * Kept out of the component so the routing and the copy can be tested without rendering.
 */

/** The example the Kart AI preview shows. Also what its call to action asks the real assistant. */
export const KART_AI_EXAMPLE_QUERY = "Geyser nahi chal raha hai";

/** The services list for a typed search; an empty search opens the whole list. */
export function searchHref(query: string): string {
  const q = query.trim();
  return q ? `/cus/services-list?search=${encodeURIComponent(q)}` : "/cus/services-list";
}
