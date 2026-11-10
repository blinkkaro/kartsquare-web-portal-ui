import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { savedItemsService } from "@/services/savedItems/savedItemsService";

const SAVED_POSTS_KEY = ["saved-items", "post"] as const;

/**
 * The signed-in user's saved post ids, loaded once (not one request per post),
 * so every post card can show its bookmark state.
 */
export const useSavedPostIds = (enabled: boolean) => {
  return useQuery({
    queryKey: SAVED_POSTS_KEY,
    queryFn: () => savedItemsService.getSavedIds("post"),
    enabled,
    staleTime: 5 * 60 * 1000,
    select: (ids) => new Set(ids),
  });
};

/** Save or unsave a post, updating the bookmark immediately and rolling back on failure. */
export const useToggleSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, saved }: { postId: string; saved: boolean }) =>
      saved ? savedItemsService.unsave("post", postId) : savedItemsService.save("post", postId),
    onMutate: async ({ postId, saved }) => {
      await queryClient.cancelQueries({ queryKey: SAVED_POSTS_KEY });
      const previous = queryClient.getQueryData<string[]>(SAVED_POSTS_KEY);
      queryClient.setQueryData<string[]>(SAVED_POSTS_KEY, (old = []) =>
        saved ? old.filter((id) => id !== postId) : [postId, ...old],
      );
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(SAVED_POSTS_KEY, context.previous);
    },
  });
};
