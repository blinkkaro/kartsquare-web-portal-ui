import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supplierService, SupplierProfile, SupplierKyc, SupplierStore } from "@/services/supplier/supplier.service";
import { secureStorage } from "@/helper/SecureStorage";

import { ApiResponse } from "@/services/api";

export const useSupplierProfile = () => {
  return useQuery<ApiResponse<SupplierProfile>>({
    queryKey: ["supplierProfile"],
    queryFn: () => supplierService.getProfile(),
    staleTime: 0,
  });
};

export const useUpdateSupplierProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SupplierProfile>) => supplierService.updateProfile(data),
    onSuccess: (response: any) => {
      if (response?.data?.user_id || response?.data?.id) {
        const userId = response.data.user_id || response.data.id;
        // If we have a response, update the stored user details
        const existingUser = secureStorage.getItem("user_details") || {};
        secureStorage.setItem("user_details", { ...existingUser, id: userId });
      }
      queryClient.invalidateQueries({ queryKey: ["supplierProfile"] });
    },
  });
};

export const useSupplierKyc = () => {
  return useQuery<ApiResponse<SupplierKyc>>({
    queryKey: ["supplierKyc"],
    queryFn: () => supplierService.getKyc(),
    staleTime: 0,
  });
};

export const useUpdateSupplierKyc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SupplierKyc) => supplierService.updateKyc(data),
    onSuccess: (response: any) => {
      if (response?.data?.register_step) {
        secureStorage.setItem("register_step", response.data.register_step);
        const existingUser = secureStorage.getItem("user_details") || {};
        secureStorage.setItem("user_details", { ...existingUser, register_step: response.data.register_step });
      }
      queryClient.invalidateQueries({ queryKey: ["supplierKyc"] });
      queryClient.invalidateQueries({ queryKey: ["supplierProfile"] });
    },
  });
};

export const useSupplierStore = () => {
  return useQuery<ApiResponse<SupplierStore>>({
    queryKey: ["supplierStore"],
    queryFn: () => supplierService.getStore(),
    staleTime: 0,
  });
};

export const useUpdateSupplierStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SupplierStore>) => supplierService.updateStore(data),
    onSuccess: (response: any) => {
      if (response?.data?.register_step) {
        secureStorage.setItem("register_step", response.data.register_step);
        const existingUser = secureStorage.getItem("user_details") || {};
        secureStorage.setItem("user_details", { ...existingUser, register_step: response.data.register_step });
      }
      queryClient.invalidateQueries({ queryKey: ["supplierStore"] });
      queryClient.invalidateQueries({ queryKey: ["supplierProfile"] });
    },
  });
};

export const useSupplierProducts = (params: any = {}) => {
  return useQuery({
    queryKey: ["supplierProducts", params],
    queryFn: () => supplierService.getProducts(params),
  });
};

export const useSupplierProduct = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["supplierProduct", id],
    queryFn: () => supplierService.getProduct(id),
    enabled: !!id && enabled,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => supplierService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplierProducts"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      supplierService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["supplierProducts"] });
      queryClient.invalidateQueries({ queryKey: ["supplierProduct", variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supplierService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplierProducts"] });
    },
  });
};

export const useSupplierEnquiries = (params: any = {}) => {
  return useQuery({
    queryKey: ["supplierEnquiries", params],
    queryFn: () => supplierService.getEnquiries(params),
  });
};

export const useUpdateEnquiryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      supplierService.updateEnquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplierEnquiries"] });
    },
  });
};

export const useSupplierDashboard = () => {
  return useQuery({
    queryKey: ["supplierDashboard"],
    queryFn: () => supplierService.getDashboardMetrics(),
  });
};
export const useAddProduct = useCreateProduct;
export const useProductDetails = useSupplierProduct;
