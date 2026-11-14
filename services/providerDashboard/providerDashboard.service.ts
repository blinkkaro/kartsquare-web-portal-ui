import { GET, PUT } from "../api";
import { APIENDPOINTS } from "./apiEndPoints";
import { AvailabilityResponse, ProviderDashboardChartResponse, ProviderDashboardResponse } from "./providerDashboard.interface";

class ProviderDashboardService {
    async getProviderDashboardData(): Promise<ProviderDashboardResponse> {
      try {
        const response = await GET<ProviderDashboardResponse>(APIENDPOINTS.GET_PROVIDER_DASHBOARD_DATA);
        return response.data;
      } catch (error) {
        throw error;
      }   
    }

    async getProviderDashboardChartData(): Promise<ProviderDashboardChartResponse> {
      try {
        const response = await GET<ProviderDashboardChartResponse>(APIENDPOINTS.GET_PROVIDER_DASHBOARD_CHART_DATA);
        // console.log(response.data);
        return response.data;
      } catch (error) {
        throw error;
      }   
    }

    async setAvailability(isAcceptingBookings: boolean): Promise<AvailabilityResponse> {
      const response = await PUT<AvailabilityResponse>(
        APIENDPOINTS.SET_PROVIDER_AVAILABILITY,
        { is_accepting_bookings: isAcceptingBookings },
      );
      return response.data;
    }
}

export const providerDashboardService = new ProviderDashboardService();