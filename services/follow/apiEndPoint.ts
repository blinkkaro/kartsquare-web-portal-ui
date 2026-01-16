export const API_ENDPOINT = {
    FOLLOW_USER: (id: string) => `/follow/${id}`,
    UNFOLLOW_USER: (id: string) => `/follow/${id}`,
    GET_FOLLOWERS: (id: string) => `/follow/${id}/followers`,
    GET_FOLLOWING: (id: string) => `/follow/${id}/following`,
}

