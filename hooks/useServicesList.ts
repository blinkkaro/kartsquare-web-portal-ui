import { useQuery } from "@tanstack/react-query";
import { serviceListService } from "@/services/serviceList/serviceListService";
import { ServiceFilters } from "@/services/serviceList/listInteraface";

export const useServicesList = (filters?: ServiceFilters) => {
  return useQuery({
    queryKey: ["services-list", filters],
    queryFn: () => serviceListService.getServices(filters),
  });
};
