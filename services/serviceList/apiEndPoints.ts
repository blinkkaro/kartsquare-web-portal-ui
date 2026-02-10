export const SERVICE_API_ENDPOINTS = {
    GET_SERVICES: "/services",
    GET_SERVICE_BY_ID: (id: string) => `/services/${id}`,
    GET_CATEGORIES: "/categories",
    GET_CATEGORY_BY_ID: (id: string) => `/categories/${id}`,
    GET_PROVIDER_SERVICES: "/services/serviceProvider",
    CREATE_SERVICE: "/services",
    INCREASE_PHONE_NUMBER: (id: string) => `/services/${id}/increasePhoneNumberViewCount`,
};
