import { GET } from "../api";
import { UserBooking } from "./bookingInterface";

export const providerBookingService = {
    async getProviderBookings(): Promise<UserBooking[]> {
        const response = await GET<UserBooking[]>("/service-bookings/provider/bookings");
        return response.data;
    }
};
