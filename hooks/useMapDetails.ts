import { useQuery } from "@tanstack/react-query";
import {
  mapDetailsService,
  MapDetailsParams,
} from "@/services/map/mapDetailsService";

export const useMapDetails = (params?: MapDetailsParams, enabled = true) => {
  return useQuery({
    queryKey: ["map-details", params],
    queryFn: () => mapDetailsService.getMapDetails(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled,
  });
};
