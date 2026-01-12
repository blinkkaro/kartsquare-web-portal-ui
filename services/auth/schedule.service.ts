import { IWorkingHour } from "./auth.interface";
import { PUT } from "../api";
import { API_ENDPOINTS } from "./apiEndPoint";

class ScheduleService {
  async addBulkWorkingHours(data: IWorkingHour[]): Promise<void> {
    try {
      const response = await PUT(
        API_ENDPOINTS.ADD_BULK_WORKING_HOURS,
        {
          working_hours: data,
        }
      );
      console.log(response);
      if (response.status === "success") {
      } else {
        throw new Error(response.data.message || "Failed to add working hours.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add working hours. Please try again.";
      throw new Error(errorMessage);
    }
  }
}
export const workingHoursService = new ScheduleService();
