import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: productService.createProduct,
  });
};

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: productService.updateProduct,
  });
};

export const useGetProductById = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId,
  });
};
