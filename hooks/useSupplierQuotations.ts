import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { supplierService } from "@/services/supplier/supplier.service";

interface UseSupplierQuotationsParams {
  limit?: number;
  search?: string;
  is_viewed?: boolean;
}

export const useSupplierQuotations = (params: UseSupplierQuotationsParams) => {
  return useInfiniteQuery({
    queryKey: ["supplier-quotations", params],
    queryFn: ({ pageParam = 1 }) =>
      supplierService.getQuotations({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
};

export const useMarkQuotationViewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => supplierService.markQuotationViewed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-quotations"] });
    },
  });
};
