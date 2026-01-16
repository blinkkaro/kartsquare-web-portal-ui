import { authService } from "@/services/auth/auth.service";
import { profileService } from "@/services/profile/pofileService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLogout } from "@/hooks/useLogout";
import { useAppDispatch } from "@/store/hooks";
import {
  setProfile,
  updateProfile as updateProfileRedux,
  clearProfile,
} from "@/features/ui/profileSlice";

export const useProfile = () => {
  const token = localStorage.getItem("token");
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const profile = await profileService.getUserProfile();
      // Update Redux state when profile is fetched
      dispatch(setProfile(profile));
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
      dispatch(setProfile(updatedProfile));
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

export const useDeleteProfile = () => {
  const { handleLogout } = useLogout();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: () => profileService.deleteUserProfile(),
    onSuccess: () => {
      // Clear Redux profile state
      dispatch(clearProfile());
      handleLogout();
    },
    onError: (error: any) => {
      throw error;
    },
  });
};
