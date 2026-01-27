import { useQuery } from "@tanstack/react-query";
import { useAutoGeolocation } from "./useGeolocation";
import { topSuppliersService } from "../services/topSuppliers/topSuppliers.service";
import { useMemo } from "react";

// Round coordinates to reduce unnecessary refetches
// Rounding to 4 decimal places (~11 meters precision) to prevent refetches on minor GPS fluctuations
// const roundCoordinate = (coord: number | undefined, precision: number = 4): string | undefined => {
//   if (coord === undefined) return undefined;
//   return coord.toFixed(precision);
// };

export const useTopSuggestions = (limit: string) => {
  const { coordinates } = useAutoGeolocation({ enableHighAccuracy: true });
  
  // Memoize rounded coordinates to prevent unnecessary refetches
  // const lat = useMemo(() => roundCoordinate(coordinates?.latitude), [coordinates?.latitude]);
  // const lng = useMemo(() => roundCoordinate(coordinates?.longitude), [coordinates?.longitude]);

  const providersQuery = useQuery({
    queryKey: ["topProviders", "0", "0", limit],
    queryFn: () => topSuppliersService.getTopProviders(limit, "0", "0"),
    enabled: true, // Always enable, use default coordinates if not available
    staleTime: 3 * 60 * 1000, // 3 minutes - data doesn't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });

  const servicesQuery = useQuery({
    queryKey: ["topServices", "0", "0", limit],
    queryFn: () => topSuppliersService.getTopServices(limit, "0", "0"),
    enabled: true, // Always enable, use default coordinates if not available
    staleTime: 3 * 60 * 1000, // 3 minutes - data doesn't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });
  
  return {
    provider: providersQuery.data,
    servicer: servicesQuery.data,
    isLoading: providersQuery.isLoading || servicesQuery.isLoading,
    error: providersQuery.error || servicesQuery.error,
  };
};
