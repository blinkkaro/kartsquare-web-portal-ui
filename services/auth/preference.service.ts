import { preferences } from "./auth.interface";
import api from "../api";
import { API_ENDPOINTS } from "./apiEndPoint";

class PrefranceService {
  async getPreferenceForTheUser(): Promise<preferences[]> {
    try {
      const response = await api.get<preferences[]>(API_ENDPOINTS.PREFERENCES);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to get Prefreances User";
      throw new Error(errorMessage);
    }
  }
  async addPreferenceForTheUser(preferences: string[]): Promise<void> {
    try {
      await api.post<preferences[]>(API_ENDPOINTS.PREFERENCES, { preferences });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to get Prefreances User";
      throw new Error(errorMessage);
    }
  }
}
export const prefranceService = new PrefranceService();
