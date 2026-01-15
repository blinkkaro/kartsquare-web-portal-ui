import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import followService from '../services/follow/followService';
import { IFollowResponse } from '../services/follow/followInterface';

export const useFollowList = (userId: string, limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['following', userId],
    queryFn: async ({ pageParam = 1 }) =>
      await followService.getFollowing(userId, pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage: IFollowResponse) => {
      if (!lastPage?.pagination) return undefined;
      const { page, total_pages } = lastPage.pagination;
      return page < total_pages ? page + 1 : undefined;
    },
    enabled: !!userId,
  });
};
export const useFollowersList = (userId: string, limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['followers', userId],
    queryFn: async ({ pageParam = 1 }) =>
      await followService.getFollowers(userId, pageParam as number, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage: IFollowResponse) => {
      if (!lastPage?.pagination) return undefined;
      const { page, total_pages } = lastPage.pagination;
      return page < total_pages ? page + 1 : undefined;
    },
    enabled: !!userId,
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => {
      return followService.followUser(userId);
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['following', userId] });
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

export const useUnfollowUser = (currentUserId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => {
      return followService.unfollowUser(userId);
    },
    onSuccess: (_, targetUserId) => {
      queryClient.invalidateQueries({
        queryKey: ['following', currentUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ['profile'],
        refetchType: 'all',
      });
    },
    onError: (error: any) => {
      throw error;
    },
  });
};

export const useFollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => {
      return followService.followUser(userId);
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
    },
    onError: (error: any) => {
      console.error('Follow error', error);
      throw error;
    },
  });
};
