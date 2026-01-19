import { prefranceService } from "@/services/auth/preference.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { preferences } from "@/services/auth/auth.interface";

export const usePreference = () => {
  return useQuery({
    queryKey: ["preference"],
    queryFn: () => prefranceService.getPreferenceForTheUser(),
  });
};

export const useGetUserPreference = () => {
  return useQuery({
    queryKey: ["user-preference"],
    queryFn: () => prefranceService.getUserPreferenceForTheUser(),
  });
};

export const useUpdatePreference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (preferences: string[]) =>
      prefranceService.updatePreferenceForTheUser(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-preference"] });
    },
  });
};
