import { GET } from "../api";
import { APPOINTMENT_API_ENDPOINTS } from "./apiEndPoints";
import { GetSlotsRequest, GetSlotsResponse } from "./appointmentInterface";

class AppointmentService {
    /**
     * Get available time slots for a service on a specific date
     */
    async getSlots(params: GetSlotsRequest): Promise<GetSlotsResponse> {
        try {
            const queryParams = new URLSearchParams({
                service_id: params.service_id,
                provider_id: params.provider_id,
                date: params.date,
                timezone: params.timezone,
            });

            const response = await GET<GetSlotsResponse>(
                `${APPOINTMENT_API_ENDPOINTS.GET_SLOTS}?${queryParams.toString()}`,
                {},
                false // Does not require authentication based on backend code
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching slots:", error);
            throw error;
        }
    }
}

export const appointmentService = new AppointmentService();
