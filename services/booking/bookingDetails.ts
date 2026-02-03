import { GET } from "../api";
import { BOOKING_API_ENDPOINTS } from "./apiEndPoints";
import { UserBooking, BookingDetails } from "./bookingInterface";

class BookingDetailsService {
    /**
     * Get booking details by ID
     */
    async getBookingDetails(bookingId: string): Promise<BookingDetails> {
        try {
            const response = await GET<any>(
                BOOKING_API_ENDPOINTS.GET_BOOKING_DETAILS,
                { booking_id: bookingId },
                true // Requires authentication
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching booking details:", error);
            throw error;
        }
    }

    /**
     * Get customer booking details by ID
     */
    async getCustomerBookingDetails(bookingId: string): Promise<BookingDetails> {
        try {
            const response = await GET<any>(
                BOOKING_API_ENDPOINTS.GET_CUSTOMER_BOOKING_DETAILS,
                { booking_id: bookingId },
                true // Requires authentication
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching customer booking details:", error);
            throw error;
        }
    }
}

export const bookingDetailsService = new BookingDetailsService();
