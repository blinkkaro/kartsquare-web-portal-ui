import { GET, POST, PATCH, PUT } from "../api";
import { BOOKING_API_ENDPOINTS } from "./apiEndPoints";
import { CreateBookingRequest, BookingResponse, UserBooking } from "./bookingInterface";
import { bookingListingService } from "./bookingListing";

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
     * @deprecated Use bookingListingService.getUserBookings() instead
     */
    async getUserBookings(): Promise<UserBooking[]> {
        return bookingListingService.getUserBookings();
    }

    /**
     * Update booking status
     */
    async updateBookingStatus(bookingId: string, status: string, otp?: string): Promise<any> {
        try {
            const body: any = { status };
            if (otp) body.otp = otp;

            const response = await PUT<any>(
                BOOKING_API_ENDPOINTS.UPDATE_BOOKING_STATUS(bookingId),
                body,
                {},
                true
            );
            return response.data;
        } catch (error) {
            console.error("Error updating booking status:", error);
            throw error;
        }
    }
}

export const bookingService = new BookingService();
