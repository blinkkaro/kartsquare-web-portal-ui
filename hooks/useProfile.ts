import { authService } from "@/services/auth/auth.service";
import { profileService } from "@/services/profile/pofileService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
      profile_pic?: File | string;
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

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => profileService.deleteUserProfile(),
    onSuccess: () => {
      // Clear all local storage
      localStorage.clear();
      // Clear query cache
      queryClient.clear();
      // Redirect to home page
      authService.logout();
      router.push("/");
    },
    onError: (error: any) => {
      throw error;
    },
  });
};
