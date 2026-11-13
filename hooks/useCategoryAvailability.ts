import { useQuery } from "@tanstack/react-query";
import { getCategoryAvailability } from "@/services/location/locationClient";

/**
 * Which categories have live services at the user's city (and locality, when known), with real
 * counts. One small request; never derived from a page of the services list. Disabled until a city is
 * known, so nothing is guessed.
 */
export const useCategoryAvailability = (citySlug?: string, localitySlug?: string) =>
  useQuery({
    queryKey: ["category-availability", citySlug ?? null, localitySlug ?? null],
    queryFn: () => getCategoryAvailability(citySlug as string, localitySlug),
    enabled: Boolean(citySlug),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
