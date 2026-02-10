export const APIENDPOINT = {
  GET_ACTIVE_ADVERTISEMENTS: "/advertise/active",
  CREATE_ADVERTISEMENTS: "/advertise/",
  UPDATE_ADVERTISEMENTS: (id: string) => `/advertise/${id}`,
  DELETE_ADVERTISEMENTS: (id: string) => `/advertise/${id}`,
  ADVERTIES_CLICKS: (id: string) => `/advertise/${id}/clicks`,
  GET_PROVIDER_ADVERTISEMENTS: "/advertise/provider",
  GET_ADVERTISEMENTS_BY_ID: (id: string) => `/advertise/${id}`,
};
