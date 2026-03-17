import followService from "@/services/follow/followService";
import { profileService } from "@/services/profile/pofileService";
import {
  providerPostsInterface,
  providerProfileInterface,
  providerServicesInterface,
  ProviderProfileByUsernameResponse,
} from "@/services/profile/profileInterface";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

export const useProviderProfile = (userId: string) => {
  return useQuery({
    queryKey: ["providerProfile", userId],
    queryFn: () => profileService.getProviderProfile(userId),
    enabled: !!userId,
  });
};

export const useProviderServices = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ["providerServices", userId],
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
    queryKey: ["providerPosts", userId],
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

export const useProviderReels = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ["providerReels", userId],
    queryFn: ({ pageParam = 1 }) =>
      profileService.getProviderReels(userId, pageParam, 12),
    getNextPageParam: (lastPage: providerPostsInterface, allPages) => {
      const morePagesExist =
        lastPage?.pagination?.currentPage < lastPage?.pagination?.totalPages;
      return morePagesExist ? lastPage.pagination.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!userId,
  });
};

export const useProviderProfileByUsername = (username: string) => {
  return useQuery({
    queryKey: ["providerProfileByUsername", username],
    queryFn: () => profileService.getUnifiedProfileByUsername(username),
    enabled: !!username,
  });
};

export const useFollowProvider = (userId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["providerProfile", userId];

  return useMutation({
    mutationFn: (isFollowing: boolean) =>
      isFollowing
        ? followService.unfollowUser(userId)
        : followService.followUser(userId),

    onMutate: async (isFollowing) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({
        predicate: (query) => query.queryKey[0] === "providerProfileByUsername",
      });
      await queryClient.cancelQueries({ queryKey: ["reels"] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["providerPosts"] });
      await queryClient.cancelQueries({ queryKey: ["providerReels"] });

      // Snapshot the previous values
      const previousProfile =
        queryClient.getQueryData<providerProfileInterface>(queryKey);

      const usernameQueries = queryClient.getQueriesData({
        predicate: (query) => query.queryKey[0] === "providerProfileByUsername",
      });
      const previousUsernameData = usernameQueries[0]?.[1] as
        | ProviderProfileByUsernameResponse
        | undefined;

      const previousReels = queryClient.getQueryData<any>(["reels"]);
      const previousPosts = queryClient.getQueriesData({ queryKey: ["posts"] });
      const previousProviderPosts = queryClient.getQueriesData({ queryKey: ["providerPosts"] });
      const previousProviderReels = queryClient.getQueriesData({ queryKey: ["providerReels"] });

      // Helper function to update posts/reels in cache
      const updatePostInCache = (old: any) => {
        if (!old) return old;
        // Handle infinite query structure (pages)
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) =>
                post.user.id === userId
                  ? { ...post, is_following: !isFollowing }
                  : post,
              ),
            })),
          };
        }
        // Handle regular list (posts or reels)
        if (old.posts) {
          return {
            ...old,
            posts: old.posts.map((post: any) =>
              post.user.id === userId
                ? { ...post, is_following: !isFollowing }
                : post,
            ),
          };
        }
        return old;
      };

      // Optimistically update provider profile
      if (previousProfile) {
        queryClient.setQueryData<providerProfileInterface>(queryKey, {
          ...previousProfile,
          is_following: !isFollowing,
          followers_count: isFollowing
            ? previousProfile.followers_count - 1
            : previousProfile.followers_count + 1,
        });
      }

      // Update username-based query if it exists
      if (previousUsernameData && usernameQueries[0]) {
        queryClient.setQueryData<ProviderProfileByUsernameResponse>(
          usernameQueries[0][0],
          {
            ...previousUsernameData,
            profile: {
              ...previousUsernameData.profile,
              is_following: !isFollowing,
              followers_count: isFollowing
                ? previousUsernameData.profile.followers_count - 1
                : previousUsernameData.profile.followers_count + 1,
            },
          },
        );
      }

      // Update reels and posts caches
      queryClient.setQueriesData({ queryKey: ["reels"] }, updatePostInCache);
      queryClient.setQueriesData({ queryKey: ["posts"] }, updatePostInCache);
      queryClient.setQueriesData({ queryKey: ["providerPosts"] }, updatePostInCache);
      queryClient.setQueriesData({ queryKey: ["providerReels"] }, updatePostInCache);

      // Return a context object with the snapshotted values for rollback
      return {
        previousProfile,
        previousUsernameData,
        previousReels,
        previousPosts,
        previousProviderPosts,
        previousProviderReels,
        usernameQueryKey: usernameQueries[0]?.[0],
      };
    },

    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKey, context.previousProfile);
      }
      if (context?.previousUsernameData && context?.usernameQueryKey) {
        queryClient.setQueryData(
          context.usernameQueryKey,
          context.previousUsernameData,
        );
      }
      if (context?.previousReels) {
        queryClient.setQueryData(["reels"], context.previousReels);
      }
      if (context?.previousPosts) {
        context.previousPosts.forEach(([key, data]: [any, any]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousProviderPosts) {
        context.previousProviderPosts.forEach(([key, data]: [any, any]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousProviderReels) {
        context.previousProviderReels.forEach(([key, data]: [any, any]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },

    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "providerProfileByUsername",
      });
      queryClient.invalidateQueries({ queryKey: ["reels"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["providerPosts"] });
      queryClient.invalidateQueries({ queryKey: ["providerReels"] });
    },
  });
};

export const useSupplierProfile = (username: string) => {
  return useQuery({
    queryKey: ["supplierProfile", username],
    queryFn: () => profileService.getSupplierProfile(username),
    enabled: !!username,
  });
};
