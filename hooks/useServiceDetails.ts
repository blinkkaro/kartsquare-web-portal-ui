import { useQuery } from "@tanstack/react-query";
import { serviceDetailsService } from "@/services/serviceDetails/serviceDetailsService";
import { type ServiceDetails } from "@/services/serviceDetails/serviceDetailsInterface";

/**
 * Hook to fetch service details by ID with TanStack Query
 * Prevents duplicate API calls and provides automatic caching
 */
export const useServiceDetails = (serviceId: string, enabled: boolean = true, initialData?: ServiceDetails) => {
  return useQuery({
    // The server-rendered copy has private fields removed and no signed-in state: show it at once, then
    // treat it as stale so the browser fetches the full record on mount.
    ...(initialData && { initialData, initialDataUpdatedAt: 0, refetchOnMount: true }),
    queryKey: ["service-details", serviceId],
    queryFn: () => serviceDetailsService.getServiceById(serviceId),
    enabled: enabled && !!serviceId,
    staleTime: 2 * 60 * 1000, // 2 minutes - service details don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });
};

/**
 * Hook to fetch provider's other services (related services)
 * Prevents duplicate API calls and provides automatic caching
 */
export const useProviderServices = (
  providerId: string | undefined,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["provider-services", providerId, limit],
    queryFn: () => serviceDetailsService.getProviderServices(providerId!, limit),
    enabled: enabled && !!providerId,
    staleTime: 3 * 60 * 1000, // 3 minutes - related services don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes cache
  });
};
