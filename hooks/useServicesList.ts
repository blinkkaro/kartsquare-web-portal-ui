import { useQuery } from "@tanstack/react-query";
import { serviceListService } from "@/services/serviceList/serviceListService";
import { ServiceFilters } from "@/services/serviceList/listInteraface";

export const useServicesList = (filters?: ServiceFilters, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["services-list", filters],
    queryFn: () => serviceListService.getServices(filters),
    staleTime: 1 * 60 * 1000, // 1 minute - services can change
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    enabled, // Control when the query runs
  });
};

/**
 * Hook to fetch provider services with TanStack Query
 * Prevents duplicate API calls and provides automatic caching
 */
export const useProviderServicesList = (search?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["provider-services-list", search],
    queryFn: () => serviceListService.getProviderServices({ search }),
    staleTime: 1 * 60 * 1000, // 1 minute - services can change
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    enabled, // Control when the query runs
  });
};
