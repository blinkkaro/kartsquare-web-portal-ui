import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supplierService, SupplierProfile, SupplierKyc, SupplierStore } from "@/services/supplier/supplier.service";

export const useSupplierProfile = () => {
  return useQuery({
    queryKey: ["supplierProfile"],
    queryFn: () => supplierService.getProfile(),
  });
};

export const useUpdateSupplierProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SupplierProfile>) => supplierService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplierProfile"] });
    },
  });
};

export const useSupplierKyc = () => {
  return useQuery({
    queryKey: ["supplierKyc"],
    queryFn: () => supplierService.getKyc(),
  });
};

export const useUpdateSupplierKyc = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SupplierKyc) => supplierService.updateKyc(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplierKyc"] });
    },
  });
};

export const useSupplierStore = () => {
  return useQuery({
    queryKey: ["supplierStore"],
    queryFn: () => supplierService.getStore(),
  });
};

export const useUpdateSupplierStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SupplierStore>) => supplierService.updateStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplierStore"] });
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
