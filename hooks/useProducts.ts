import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { productFilter } from "@/services/product/product.interface";
import { productService } from "@/services/product/product.service";

export const useSupplierProducts = (filters: Partial<productFilter>) => {
  return useInfiniteQuery({
    queryKey: ["supplier-products", filters],
    queryFn: async ({ pageParam = 1 }) => {
      return await productService.getSupplierProducts({
        ...filters,
        page: pageParam,
        limit: 10,
      });
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnMount: true,
  });
};

export const useGetCategories = (search?: string) => {
  return useQuery({
    queryKey: ["categories", search],
    queryFn: () => productService.getProductCategories(search),
  });
};

export const useGetSubCategories = (categoryId: string, search?: string) => {
  return useQuery({
    queryKey: ["sub-categories", categoryId, search],
    queryFn: () => productService.getProductSubCategories(categoryId, search),
    enabled: !!categoryId,
  });
};

export const useGetBrands = (subCategoryId: string, search?: string) => {
  return useQuery({
    queryKey: ["brands", subCategoryId, search],
    queryFn: () => productService.getProductBrands(subCategoryId, search),
    enabled: !!subCategoryId,
  });
};

export const useGetProductSpecifications = (subCategoryId: string) => {
  return useQuery({
    queryKey: ["specifications", subCategoryId],
    queryFn: () => productService.getProductSpecifications(subCategoryId),
    enabled: !!subCategoryId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
};

export const useGetProductById = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId,
    refetchOnMount: true,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => productService.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-products"] });
    },
  });
};
export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.updateProductStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-products"] });
    },
  });
};

export const useGetAllBrands = (search?: string, limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ["all-brands", search, limit],
    queryFn: async ({ pageParam = 1 }) => {
      return await productService.getAllBrands(search, limit, pageParam);
    },
    getNextPageParam: (lastPage: any, allPages) => {
      if (Array.isArray(lastPage)) {
        return lastPage.length === limit ? allPages.length + 1 : undefined;
      }
      if (!lastPage || !lastPage.pagination) return undefined;
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
