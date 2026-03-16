import { GetPostsParams } from "@/services/post/postInterfaces";
import { postServices } from "@/services/post/postServices";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { secureStorage } from "@/helper/SecureStorage";

export const useGetPosts = (params: GetPostsParams) => {
  return useQuery({
    queryKey: ["posts", params.visibility, params.limit, params.cursor],
    queryFn: () => postServices.getPosts(params),
  });
};

export const useGetInfinitePosts = (params: Omit<GetPostsParams, "cursor">) => {
  return useInfiniteQuery({
    queryKey: ["posts", params.visibility, params.limit],
    queryFn: ({ pageParam }) =>
      postServices.getPosts({ ...params, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialPageParam: undefined as string | undefined,
  });
};

export const useGetPostComments = (postId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["post-comments", postId],
    queryFn: () => postServices.getPostComments(postId),
    enabled,
  });
};

export const useAddPostComment = (postId: string) => {
  const queryClient = useQueryClient();
  const profile = secureStorage.getItem("user_details");

  return useMutation({
    mutationFn: (comment: string) =>
      postServices.addPostComments(postId, comment),
    onMutate: async (comment: string) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post-comments", postId] });

      const previousComments = queryClient.getQueriesData({
        queryKey: ["post-comments", postId],
      });

      const newCommentId = `temp-${Date.now()}-${Math.random()}`.toString();
      const newComment = {
        id: newCommentId,
        user_id: profile?.id,
        post_id: postId,
        comment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_first_name: profile?.first_name,
        user_last_name: profile?.last_name,
        user_profile_pic: profile?.profile_pic,
      };

      queryClient.setQueryData(["post-comments", postId], (old: any) => {
        if (!old) return { comments: [newComment] };
        return {
          ...old,
          comments: [newComment, ...(old.comments || [])],
        };
      });

      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: any) => {
        if (!old?.posts) return old;
        return {
          ...old,
          posts: old.posts.map((post: any) =>
            post.id === postId
              ? { ...post, comments_count: (post.comments_count || 0) + 1 }
              : post,
          ),
        };
      });

      return { previousComments, newCommentId };
    },
    onSuccess: async (data: { commentId: string }, variables, context) => {
      const realId = data.commentId;
      const tempId = context?.newCommentId;
      await queryClient.setQueryData(["post-comments", postId], (old: any) => {
        if (!old?.comments) return old;

        const updatedComments = old.comments.map((c: any) =>
          c.id === tempId ? { ...c, id: realId } : c,
        );
        return {
          ...old,
          comments: updatedComments,
        };
      });
    },
    onError: (err, newTodo, context) => {
      if (context?.previousComments) {
        context.previousComments.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: any) => {
        if (!old?.posts) return old;
        return {
          ...old,
          posts: old.posts.map((post: any) =>
            post.id === postId
              ? { ...post, comments_count: (post.comments_count || 0) - 1 }
              : post,
          ),
        };
      });
    },
  });
};

export const useLikePost = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postServices.likePost(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["providerPosts"] });
      await queryClient.cancelQueries({ queryKey: ["providerReels"] });
      await queryClient.cancelQueries({
        predicate: (query) => query.queryKey[0] === "providerProfileByUsername",
      });

      const previousPosts = queryClient.getQueriesData({ queryKey: ["posts"] });
      const previousProviderPosts = queryClient.getQueriesData({
        queryKey: ["providerPosts"],
      });
      const previousProviderReels = queryClient.getQueriesData({
        queryKey: ["providerReels"],
      });
      const previousProfileByUsername = queryClient.getQueriesData({
        predicate: (query) => query.queryKey[0] === "providerProfileByUsername",
      });

      const updatePostInCache = (old: any) => {
        if (!old) return old;
        // Handle infinite query structure (pages) or regular list (posts)
        if (old.pages) {
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              posts: page.posts.map((post: any) => {
                if (post.id === postId) {
                  const wasLiked = post.is_liked;
                  return {
                    ...post,
                    is_liked: !wasLiked,
                    likes_count: wasLiked
                      ? post.likes_count - 1
                      : post.likes_count + 1,
                  };
                }
                return post;
              }),
            })),
          };
        } else if (old.posts) {
          return {
            ...old,
            posts: old.posts.map((post: any) => {
              if (post.id === postId) {
                const wasLiked = post.is_liked;
                return {
                  ...post,
                  is_liked: !wasLiked,
                  likes_count: wasLiked
                    ? post.likes_count - 1
                    : post.likes_count + 1,
                };
              }
              return post;
            }),
          };
        }
        return old;
      };

      queryClient.setQueriesData({ queryKey: ["posts"] }, updatePostInCache);
      queryClient.setQueriesData(
        { queryKey: ["providerPosts"] },
        updatePostInCache,
      );
      queryClient.setQueriesData(
        { queryKey: ["providerReels"] },
        updatePostInCache,
      );

      // Update providerProfileByUsername cache
      queryClient.setQueriesData(
        {
          predicate: (query) =>
            query.queryKey[0] === "providerProfileByUsername",
        },
        updatePostInCache,
      );

      return {
        previousPosts,
        previousProviderPosts,
        previousProviderReels,
        previousProfileByUsername,
      };
    },
    onSuccess: (data: any) => {
      if (data && typeof data.liked === "boolean") {
        const updateVerifyPost = (old: any) => {
          if (!old) return old;
          if (old.pages) {
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                posts: page.posts.map((post: any) => {
                  if (post.id === postId) {
                    return { ...post, is_liked: data.liked };
                  }
                  return post;
                }),
              })),
            };
          } else if (old.posts) {
            return {
              ...old,
              posts: old.posts.map((post: any) => {
                if (post.id === postId) {
                  return { ...post, is_liked: data.liked };
                }
                return post;
              }),
            };
          }
          return old;
        };

        queryClient.setQueriesData({ queryKey: ["posts"] }, updateVerifyPost);
        queryClient.setQueriesData(
          { queryKey: ["providerPosts"] },
          updateVerifyPost,
        );
        queryClient.setQueriesData(
          { queryKey: ["providerReels"] },
          updateVerifyPost,
        );
        queryClient.setQueriesData(
          {
            predicate: (query) =>
              query.queryKey[0] === "providerProfileByUsername",
          },
          updateVerifyPost,
        );
      }
    },
    onError: (err, variables, context) => {
      if (context?.previousPosts) {
        context.previousPosts.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousProviderPosts) {
        context.previousProviderPosts.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousProviderReels) {
        context.previousProviderReels.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousProfileByUsername) {
        context.previousProfileByUsername.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
  });
};

export const useGetReels = () => {
  return useQuery({
    queryKey: ["reels"],
    queryFn: () => postServices.getReels(),
  });
};
