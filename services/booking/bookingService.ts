import { GET, POST } from "../api";
import { BOOKING_API_ENDPOINTS } from "./apiEndPoints";
import { CreateBookingRequest, BookingResponse, UserBooking } from "./bookingInterface";

class BookingService {
    /**
     * Create a new service booking
     */
    async createBooking(bookingData: CreateBookingRequest): Promise<BookingResponse> {
        try {
            const response = await POST<any>(
                BOOKING_API_ENDPOINTS.CREATE_BOOKING,
                bookingData,
                {},
                true // Requires authentication
            );
            return response.data;
        } catch (error) {
            console.error("Error creating booking:", error);
            throw error;
        }
    }

    /**
     * Get all bookings for the current user
     */
    async getUserBookings(): Promise<UserBooking[]> {
        try {
            const response = await GET<any>(
                BOOKING_API_ENDPOINTS.GET_USER_BOOKINGS,
                {},
                true // Requires authentication
            );
            return response.data || [];
        } catch (error) {
            console.error("Error fetching user bookings:", error);
            throw error;
        }
    }
}

export const bookingService = new BookingService();
