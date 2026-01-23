import { useQuery } from "@tanstack/react-query";
import { useAutoGeolocation } from "./useGeolocation";
import { topSuppliersService } from "../services/topSuppliers/topSuppliers.service";

export const useTopSuggestions = (limit: string) => {
  const { coordinates } = useAutoGeolocation({ enableHighAccuracy: true });
  const lat = coordinates?.latitude.toString();
  const lng = coordinates?.longitude.toString();

  const providersQuery = useQuery({
    queryKey: ["topProviders", lat, lng, limit],
    queryFn: () => topSuppliersService.getTopProviders(limit, lat!, lng!),
    enabled: true, // Always enable, use default coordinates if not available
  });

  const servicesQuery = useQuery({
    queryKey: ["topServices", lat, lng, limit],
    queryFn: () => topSuppliersService.getTopServices(limit, lat!, lng!),
    enabled: true, // Always enable, use default coordinates if not available
  });
  
  return {
    provider: providersQuery.data,
    servicer: servicesQuery.data,
    isLoading: providersQuery.isLoading || servicesQuery.isLoading,
    error: providersQuery.error || servicesQuery.error,
  };
};
