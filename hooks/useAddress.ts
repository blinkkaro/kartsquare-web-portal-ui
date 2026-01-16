import { addressServices } from "@/services/address/addressServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAddress = () => {
  return useQuery({
    queryKey: ["address"],
    queryFn: () => addressServices.getAddress(),
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => addressServices.addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => addressServices.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      addressServices.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address"] });
    },
  });
};
