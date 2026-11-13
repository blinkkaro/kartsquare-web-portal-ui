import { useAILocation } from "@/components/common/Ai/useAILocation";
import { useServicesList } from "@/hooks/useServicesList";
import { toSlug } from "@/services/location/locationClient";

/** How many cards the home page reads service types from. Category availability is NOT derived from this. */
export const HOME_SERVICE_CARD_LIMIT = 24;

/**
 * A small page of live services in the visitor's city, for the service types the hero, the marquee and
 * "popular in your city" name (view=card: no SEO payload). One shared, cached request. Category
 * availability comes from useCategoryAvailability, not from this list. The city and locality are part of
 * the query key, so changing the selected place refetches.
 */
export const useHomeServices = () => {
  const { location } = useAILocation();
  const city_slug = location.city ? toSlug(location.city) : undefined;
  const locality_slug = location.locality ? toSlug(location.locality) : undefined;
  const query = useServicesList({
    limit: HOME_SERVICE_CARD_LIMIT,
    view: "card",
    ...(city_slug ? { city_slug } : {}),
    ...(city_slug && locality_slug ? { locality_slug } : {}),
  });
  return { ...query, services: query.data?.services ?? [] };
};
