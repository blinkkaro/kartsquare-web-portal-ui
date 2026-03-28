import { authService } from "@/services/auth/auth.service";
import { profileService } from "@/services/profile/pofileService";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useLogout } from "@/hooks/useLogout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateUser } from "@/features/ui/authSlice";
import { secureStorage } from "@/helper/SecureStorage";
import { providerPostsInterface } from "@/services/profile/profileInterface";
import { User } from "@/services/auth/auth.interface";
import { CreatePostParams } from "@/services/post/postInterfaces";
import { postServices } from "@/services/post/postServices";

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
      banner_image?: File | string;
      first_name: string;
      last_name: string;
      bio?: string;
      profile_pic?: File | string;
      username?: string;
    }) =>
      profileService.updateUserProfile(
        data.first_name,
        data.last_name,
        data.bio,
        data.profile_pic,
        data.username,
        data.banner_image,
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

export const useUpdateShowNumber = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (show_number: boolean) =>
      profileService.updateShowNumber(show_number),
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

export const usePosts = (isOpen: boolean) => {
  const user: User = secureStorage.getItem("user_details");
  const userId = user.id;
  return useInfiniteQuery({
    queryKey: ["providerPosts"],
    queryFn: ({ pageParam = 1 }) =>
      profileService.getProviderPosts(userId, pageParam, 12),
    getNextPageParam: (lastPage: providerPostsInterface, allPages) => {
      const morePagesExist =
        lastPage?.pagination?.currentPage < lastPage?.pagination?.totalPages;
      return morePagesExist ? lastPage.pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!userId && isOpen,
  });
};

export const useReels = (isOpen: boolean) => {
  const user: User = secureStorage.getItem("user_details");
  const userId = user.id;
  return useInfiniteQuery({
    queryKey: ["providerReels"],
    queryFn: ({ pageParam = 1 }) =>
      profileService.getProviderReels(userId, pageParam, 12),
    getNextPageParam: (lastPage: providerPostsInterface, allPages) => {
      const morePagesExist =
        lastPage?.pagination?.currentPage < lastPage?.pagination?.totalPages;
      return morePagesExist ? lastPage.pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!userId && isOpen,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostParams) => postServices.createPost(data),
    onSuccess: () => {
      // Invalidate React Query cache so both the posts grid and reels grid
      // update in real time immediately after a post/reel is created.
      queryClient.invalidateQueries({ queryKey: ["providerPosts"] });
      queryClient.invalidateQueries({ queryKey: ["providerReels"] });
    },
    onError: (error: any) => {
      throw error;
    },
  });
};
