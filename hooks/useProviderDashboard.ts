import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { providerDashboardService } from "../services/providerDashboard/providerDashboard.service";
import type { ProviderDashboardResponse } from "../services/providerDashboard/providerDashboard.interface";

export const useProviderDashboard = (enabled: boolean = true) => {
  const {
    data: providerDashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["provider-dashboard"],
    queryFn: () => providerDashboardService.getProviderDashboardData(),
    enabled: enabled,
  });
  const {
    data: providerDashboardChartData,
    isLoading: chartLoading,
    error: chartError,
  } = useQuery({
    queryKey: ["provider-dashboard-chart"],
    queryFn: () => providerDashboardService.getProviderDashboardChartData(),
    enabled: enabled,
  });
  return {
    providerDashboardData,
    providerDashboardChartData,
    isLoading: isLoading || chartLoading,
    error: error || chartError,
  };
};

/** Open / Away switch. Updates the cached dashboard at once and rolls back on failure. */
export const useSetAvailability = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accepting: boolean) => providerDashboardService.setAvailability(accepting),
    onMutate: async (accepting) => {
      await queryClient.cancelQueries({ queryKey: ["provider-dashboard"] });
      const previous = queryClient.getQueryData<ProviderDashboardResponse>(["provider-dashboard"]);
      if (previous?.profile) {
        queryClient.setQueryData<ProviderDashboardResponse>(["provider-dashboard"], {
          ...previous,
          profile: { ...previous.profile, is_accepting_bookings: accepting },
        });
      }
      return { previous };
    },
    onError: (_error, _accepting, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["provider-dashboard"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["provider-dashboard"] }),
  });
};
