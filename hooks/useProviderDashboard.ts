import { useQuery } from "@tanstack/react-query";
import { providerDashboardService } from "../services/providerDashboard/providerDashboard.service";

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
