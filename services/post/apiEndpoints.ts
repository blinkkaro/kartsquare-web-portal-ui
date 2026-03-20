export const API_ENDPOINTS = {
    GET_POST: "/social_posts/posts_feed",
    GET_POST_COMMENT: (postId: string, limit: number, offset: number) => `/social_posts/${postId}/comments?limit=${limit}&offset=${offset}`,
    ADD_COMMENT: (postId: string) => `/social_posts/${postId}/comments`,
    LIKE_POST: (postId: string) => `/social_posts/${postId}/like`,
    CREATE_POST: "/social_posts/",
    GET_REELS: "/social_posts/reels"
}