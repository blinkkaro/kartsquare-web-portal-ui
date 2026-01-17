import { prefranceService } from "@/services/auth/preference.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { preferences } from "@/services/auth/auth.interface";

export const usePreference = () => {
  return useQuery({
    queryKey: ["preference"],
    queryFn: () => prefranceService.getPreferenceForTheUser(),
  });
};

export const useUpdatePreference = (preferences: preferences[]) => {
  return useMutation({
    mutationFn: () =>
      prefranceService.updatePreferenceForTheUser(preferences),
  });
};

