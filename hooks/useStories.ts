import { secureStorage } from "@/helper/SecureStorage";
import {
  CreateStory,
  StoriesListResponse,
} from "@/services/stories/stories.interface";
import { storiesService } from "@/services/stories/stories.service";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const useGetStories = (params: { page: number; limit: number }) => {
  const token = secureStorage.getItem("token");
  return useInfiniteQuery({
    queryKey: ["stories", params.page ?? 1, params.limit ?? 10],
    queryFn: ({ pageParam }) =>
      storiesService.getStories(
        (pageParam as number) ?? params.page,
        params.limit
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.pagination.page;
      const totalPages = lastPage.pagination.totalpages;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
    enabled: !!token,
  });
};

export const useAddStory = () => {
  const queryClient = useQueryClient();
  const profile = secureStorage.getItem("user_details");
  return useMutation({
    mutationFn: (story: CreateStory) => storiesService.createStory(story),

    onMutate: async (newStory) => {
      const queryKey = ["stories", 1, 10];

      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<InfiniteData<StoriesListResponse>>(queryKey);

      const optimisticStory = {
        ...newStory,
        story_id: Date.now().toString(),
        user_id: profile?.id ?? "",
        user_name: profile?.first_name ?? "",
        user_profile_image: profile?.profile_pic ?? "",
        media_url: newStory.media,
        created_at: new Date(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        is_visited: false,
      };

      queryClient.setQueryData<InfiniteData<StoriesListResponse>>(
        queryKey,
        (oldData) => {
          if (!oldData) return { pages: [], pageParams: [] };

          return {
            ...oldData,
            pages: oldData.pages.map((page, index) => {
              if (index === 0) {
                const pageStories = page.stories || [];
                const userId = profile?.id ?? "";
                const optimisticStoryAny = optimisticStory as any;
                const userIndex = pageStories.findIndex(
                  (s) => s.user_id === userId
                );

                let newStoriesList;
                if (userIndex >= 0) {
                  newStoriesList = pageStories.map((s, i) =>
                    i === userIndex
                      ? {
                          ...s,
                          stories: [optimisticStoryAny, ...(s.stories || [])],
                        }
                      : s
                  );
                } else {
                  const newEntry = {
                    user_id: userId,
                    user_name: profile?.first_name ?? "",
                    user_profile_image: profile?.profile_pic ?? "",
                    stories: [optimisticStoryAny],
                  };
                  newStoriesList = [newEntry, ...pageStories];
                }

                return {
                  ...page,
                  stories: newStoriesList,
                };
              }
              return page;
            }),
          };
        }
      );

      return { previousData };
    },
    onError: (err, newStory, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["stories", 1, 10], context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["stories", 1, 10] });
    },
  });
};

export const useViewStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storiesService.viewStory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
};

export const useDeleteStory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => storiesService.deleteStory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
};
