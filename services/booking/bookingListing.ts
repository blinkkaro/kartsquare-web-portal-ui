import { GET } from "../api";
import { BOOKING_API_ENDPOINTS } from "./apiEndPoints";
import { UserBooking } from "./bookingInterface";

interface BookingListParams {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
}

class BookingListingService {
    /**
     * Get all bookings for the current user
     */
    async getUserBookings(params?: BookingListParams): Promise<UserBooking[]> {
        try {
            const response = await GET<any>(
                BOOKING_API_ENDPOINTS.GET_USER_BOOKINGS,
                params || {},
                true // Requires authentication
            );
            return response.data || [];
        } catch (error) {
            console.error("Error fetching user bookings:", error);
            throw error;
        }
    }

    /**
     * Get bookings by status
     */
    async getBookingsByStatus(status: string): Promise<UserBooking[]> {
        return this.getUserBookings({ status });
    }

    /**
     * Search bookings
     */
    async searchBookings(searchQuery: string): Promise<UserBooking[]> {
        return this.getUserBookings({ search: searchQuery });
    }
}

export const bookingListingService = new BookingListingService();
