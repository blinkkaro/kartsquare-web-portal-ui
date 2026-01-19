import followService from '@/services/follow/followService';
import { profileService } from '@/services/profile/pofileService';
import { providerPostsInterface, providerProfileInterface, providerServicesInterface } from '@/services/profile/profileInterface';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';

export const useProviderProfile = (userId: string) => {
  return useQuery({
    queryKey: ['providerProfile', userId],
    queryFn: () => profileService.getProviderProfile(userId),
    enabled: !!userId,
  });
};

export const useProviderServices = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ['providerServices', userId],
    queryFn: ({ pageParam = 1 }) =>
      profileService.getProviderServices(userId, pageParam, 10),
    getNextPageParam: (
      lastPage: providerServicesInterface,
      allPages: providerServicesInterface[],
    ) => {
      const morePagesExist =
        lastPage?.pagination?.currentPage < lastPage?.pagination?.totalPages;
      return morePagesExist ? lastPage.pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!userId,
  });
};

export const useProviderPosts = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ['providerPosts', userId],
    queryFn: ({ pageParam = 1 }) =>
      profileService.getProviderPosts(userId, pageParam, 12),
    getNextPageParam: (lastPage: providerPostsInterface, allPages) => {
      const morePagesExist =
        lastPage?.pagination?.currentPage < lastPage?.pagination?.totalPages;
      return morePagesExist ? lastPage.pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!userId,
  });
};

export const useFollowProvider = (userId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['providerProfile', userId];

  return useMutation({
    mutationFn: (isFollowing: boolean) =>
      isFollowing
        ? followService.unfollowUser(userId)
        : followService.followUser(userId),

    onMutate: async isFollowing => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousProfile =
        queryClient.getQueryData<providerProfileInterface>(queryKey);

      // Optimistically update to the new value
      if (previousProfile) {
        queryClient.setQueryData<providerProfileInterface>(queryKey, {
          ...previousProfile,
          is_following: !isFollowing,
          followers_count: isFollowing
            ? previousProfile.followers_count - 1
            : previousProfile.followers_count + 1,
        });
      }

      // Return a context object with the snapshotted value
      return { previousProfile };
    },

    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKey, context.previousProfile);
      }
    },

    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
