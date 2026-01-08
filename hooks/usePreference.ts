import { prefranceService } from "@/services/auth/preference.service";
import { useQuery } from "@tanstack/react-query";

export const usePreference = () => {
  return useQuery({
    queryKey: ["preference"],
    queryFn: () => prefranceService.getPreferenceForTheUser(),
  });
};
