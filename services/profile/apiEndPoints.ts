export const APIENDPOINTS = {
  GET_USER_PROFILE: '/profile/me',
  UPDATE_USER_PROFILE: '/profile',
  DELETE_USER_PROFILE: '/profile/delete-account',
  GET_PROVIDER_PROFILE: (id: string) => `/profile/${id}`,
  GET_PROVIDER_POSTS: (id: string, page?: number, limit?: number) =>
    `/profile/${id}/posts?page=${page}&limit=${limit}`,
  GET_PROVIDER_SERVICES: (id: string, page?: number, limit?: number) =>
    `/profile/${id}/services?page=${page}&limit=${limit}`,
};
