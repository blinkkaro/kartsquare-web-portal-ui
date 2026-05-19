import { useQuery } from "@tanstack/react-query";
import { GET } from "@/services/api";

export interface SubCategory {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  is_deleted: boolean;
}

export const useSubCategories = (categoryIds: string[]) => {
  return useQuery({
    queryKey: ["subcategories", categoryIds],
    queryFn: async () => {
      if (!categoryIds || categoryIds.length === 0) return [];
      
      const params = new URLSearchParams();
      categoryIds.forEach(id => params.append("category_ids", id));
      
      const response = await GET<SubCategory[]>(`/subcategories?${params.toString()}`, {}, true);
      return response.data;
    },
    enabled: categoryIds.length > 0,
    staleTime: 10 * 60 * 1000,
  });
};
