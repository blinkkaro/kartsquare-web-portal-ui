export const APIENDPOINTS = {
  GET_USER_PROFILE: '/profile/me',
  UPDATE_USER_PROFILE: '/profile',
  DELETE_USER_PROFILE: '/profile/delete-account',
  GET_PROVIDER_PROFILE: (id: string) => `/profile/${id}`,
  GET_PROVIDER_PROFILE_BY_USERNAME: (username: string) => `/profile/provider/${username}`,
  GET_PROVIDER_POSTS: (id: string, page?: number, limit?: number) =>
    `/profile/${id}/posts?page=${page}&limit=${limit}`,
  GET_PROVIDER_SERVICES: (id: string, page?: number, limit?: number) =>
    `/profile/${id}/services?page=${page}&limit=${limit}`,
  GET_SUPPLIER_PROFILE: (id: string) => `/profile/supplier/${id}`,
  GET_PROVIDER_REELS: (id: string, page?: number, limit?: number) =>
    `/profile/${id}/reels?page=${page}&limit=${limit}`,
};
