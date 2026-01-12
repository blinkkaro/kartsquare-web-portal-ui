import { GetPostsParams } from "@/services/post/postInterfaces";
import { postServices } from "@/services/post/postServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "./useProfile";

export const useGetPosts = (params: GetPostsParams) => {
  return useQuery({
    queryKey: ["posts", params.visibility, params.limit],
    queryFn: () => postServices.getPosts(params),
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
  const { data: profile } = useProfile();

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
              : post
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
          c.id === tempId ? { ...c, id: realId } : c
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

      const previousPosts = queryClient.getQueriesData({ queryKey: ["posts"] });
      const previousProviderPosts = queryClient.getQueriesData({
        queryKey: ["providerPosts"],
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
        updatePostInCache
      );

      return { previousPosts, previousProviderPosts };
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
          updateVerifyPost
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
    },
  });
};
