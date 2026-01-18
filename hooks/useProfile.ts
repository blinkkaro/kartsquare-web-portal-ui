import { authService } from "@/services/auth/auth.service";
import { profileService } from "@/services/profile/pofileService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLogout } from "@/hooks/useLogout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUser } from "@/features/ui/authSlice";
import { secureStorage } from "@/helper/SecureStorage";

export const useProfile = () => {
  const token = secureStorage.getItem("token");
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const profile = await profileService.getUserProfile();
      dispatch(updateUser(profile as any));
      return profile;
    },
    enabled: !!token,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

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
    onSuccess: (updatedProfile) => {
      // Invalidate React Query cache
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      // Update Redux state with the updated profile
      dispatch(updateUser(updatedProfile as any));
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

export const useDeleteProfile = () => {
  const { handleLogout } = useLogout();

  return useMutation({
    mutationFn: () => profileService.deleteUserProfile(),
    onSuccess: () => {
      handleLogout();
    },
    onError: (error: any) => {
      throw error;
    },
  });
};
