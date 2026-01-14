import { profileService } from "@/services/profile/pofileService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProfile = () => {
  const token = localStorage.getItem("token");
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.getUserProfile(),
    enabled: !!token,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      first_name: string;
      last_name: string;
      bio?: string;
      profile_pic?: File;
    }) =>
      profileService.updateUserProfile(
        data.first_name,
        data.last_name,
        data.bio,
        data.profile_pic
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: any) => {
      throw error;
    },
  });
};
