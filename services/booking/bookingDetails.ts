import { GET } from "../api";
import { BOOKING_API_ENDPOINTS } from "./apiEndPoints";
import { UserBooking } from "./bookingInterface";

class BookingDetailsService {
    /**
     * Get booking details by ID
     */
    async getBookingDetails(bookingId: string): Promise<UserBooking> {
        try {
            const response = await GET<any>(
                `${BOOKING_API_ENDPOINTS.GET_BOOKING_DETAILS}/${bookingId}`,
                {},
                true // Requires authentication
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching booking details:", error);
            throw error;
        }
    }
}

export const bookingDetailsService = new BookingDetailsService();
