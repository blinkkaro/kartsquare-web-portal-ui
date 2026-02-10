import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { advertiseService } from "@/services/advertise/advertiseServies";
import {
  ProviderAdFilters,
  AdvertiseCreate,
  AdvertiseUpdate,
} from "@/services/advertise/advertise.intreface";

export const useProviderAdvertisements = (
  filters: ProviderAdFilters,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["provider-advertisements", filters],
    queryFn: () => advertiseService.getProviderAdvertisements(filters),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: true,
    retry: 2,
  });
};

export const useActiveAdvertisements = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["active-advertisements"],
    queryFn: () => advertiseService.getActiveAdvertisements(),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled,
  });
};

export const useAdvertisementById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["advertisement", id],
    queryFn: () => advertiseService.getAdvertisementsById(id),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    enabled: enabled && !!id,
  });
};

export const useDeleteAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (advertiseId: string) =>
      advertiseService.deleteAdvertise(advertiseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["provider-advertisements"],
      });
    },
  });
};

export const useCreateAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdvertiseCreate) =>
      advertiseService.createAdvertise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["provider-advertisements"],
      });
    },
  });
};

export const useUpdateAdvertisement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdvertiseUpdate) =>
      advertiseService.updateAdvertise(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["provider-advertisements"],
      });
      queryClient.invalidateQueries({
        queryKey: ["advertisement", variables.advertise_id],
      });
    },
  });
};
