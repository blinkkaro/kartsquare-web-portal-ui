import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BusinessInfoFormData } from "@/components/pages/businessInfo/businessInfoSchema";
import { businessInfoService, type BusinessInfoUpdate } from "@/services/auth/businessInfo.service";

export const useGetBusinessInfo = () => {
  return useQuery({
    queryKey: ["businessInfo"],
    queryFn: () => businessInfoService.getBusinessInfo(),
  });
};

export const useAddBusinessInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BusinessInfoFormData) => businessInfoService.addBusinessInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businessInfo"] });
    },
  });
};

export const useUpdateBusinessInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BusinessInfoUpdate) => businessInfoService.updateBusinessInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businessInfo"] });
    },
  });
};
