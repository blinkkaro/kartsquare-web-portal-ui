export const ApiEndPoints = {
  GET_TOP_PROVIDERS: (limit: string, latitude: string, longitude: string) =>
    `/homepage/top-providers?limit=${limit}&latitude=${latitude}&longitude=${longitude}`,
  GET_TOP_SERVICES: (limit: string, latitude: string, longitude: string) =>
    `/homepage/top-services?limit=${limit}&latitude=${latitude}&longitude=${longitude}`,
};
