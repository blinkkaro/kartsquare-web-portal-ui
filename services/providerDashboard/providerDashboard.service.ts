import { GET } from "../api";
import { APIENDPOINTS } from "./apiEndPoints";
import { ProviderDashboardChartResponse, ProviderDashboardResponse } from "./providerDashboard.interface";

class ProviderDashboardService {
    async getProviderDashboardData(): Promise<ProviderDashboardResponse> {
      try {
        const response = await GET<ProviderDashboardResponse>(APIENDPOINTS.GET_PROVIDER_DASHBOARD_DATA);
        console.log(response.data);
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
}

export const providerDashboardService = new ProviderDashboardService();