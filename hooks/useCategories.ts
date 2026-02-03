import { useQuery } from "@tanstack/react-query";
import { serviceListService } from "@/services/serviceList/serviceListService";
import { Category } from "@/services/serviceList/listInteraface";

/**
 * Hook to fetch categories with TanStack Query caching
 * Categories don't change frequently, so we use longer cache times
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => serviceListService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes - categories rarely change
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    select: (data) => data.filter((cat) => !cat.is_deleted), // Filter deleted categories
  });
};
