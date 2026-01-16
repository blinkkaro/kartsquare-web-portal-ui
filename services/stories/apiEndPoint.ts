export const APIENDPOINT = {
    CREATE_STORY: '/stories',
    GET_STORIES: (page: number, limit: number) => `/stories?page=${page}&limit=${limit}`,
    DELETE_STORY: (id: string) => `/stories/${id}`,
    UPDATE_STORY: (id: string) => `/stories/${id}`,
    VIEW_STORY: (id: string) => `/stories/${id}/view`,
    GET_VIEWER_LIST: (id: string) => `/stories/${id}/view`,
}