import { useQuery } from "@tanstack/react-query";
import supplierDashboardService from "../services/supplierDashboard/supplierDashboard.service";

export const useSupplierDashboard = (enabled: boolean = true) => {
  const {
    data: supplierDashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["supplier-dashboard"],
    queryFn: () => supplierDashboardService.getSupplierDashboard(),
    enabled: enabled,
  });
  const {
    data: supplierDashboardChartData,
    isLoading: chartLoading,
    error: chartError,
  } = useQuery({
    queryKey: ["supplier-dashboard-chart"],
    queryFn: () => supplierDashboardService.getSupplierDashboardChart(),
    enabled: enabled,
  });
  return {
    supplierDashboardData,
    supplierDashboardChartData,
    isLoading: isLoading || chartLoading,
    error: error || chartError,
  };
};
