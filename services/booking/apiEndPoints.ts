export const BOOKING_API_ENDPOINTS = {
    CREATE_BOOKING: "/service-bookings/create",
    GET_USER_BOOKINGS: "/service-bookings/user/bookings",
    GET_BOOKING_DETAILS: "/service-bookings/provider/details",
    GET_CUSTOMER_BOOKING_DETAILS: "/service-bookings/user/details",
    UPDATE_BOOKING_STATUS: (bookingId: string) => `/service-bookings/${bookingId}/status`,
};
