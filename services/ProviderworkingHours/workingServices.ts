import { DELETE, GET, POST, PUT } from '../api';
import { API_ENDPOINTS } from './apiEndPoints';
import {
  IUpdateWorkingHour,
  IWorkingHour,
  getWorkingHour,
} from './workingHoursInterfaces';

class ProviderWorkingHours {
  async getWorkingHours(): Promise<getWorkingHour[]> {
    try {
      const response = await GET<getWorkingHour[]>(
        API_ENDPOINTS.GET_WORKING_HOURS,
      );
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get working hours.');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to get working hours. Please try again.';
      throw new Error(errorMessage);
    }
  }
  async addWorkingHours(data: IWorkingHour): Promise<void> {
    try {
      console.log(data);
      const response = await POST(API_ENDPOINTS.ADD_WORKING_HOURS, {
        working_hours: data,
      });
      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to add working hours.');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to add working hours. Please try again.';
      throw new Error(errorMessage);
    }
  }
  async updateWorkingHours(data: IUpdateWorkingHour): Promise<void> {
    try {
      console.log(data);
      const response = await PUT(API_ENDPOINTS.UPDATE_WORKING_HOURS, {
        working_hours: data,
      });
      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to update working hours.');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update working hours. Please try again.';
      throw new Error(errorMessage);
    }
  }
  async deleteAllWorkingHours(): Promise<void> {
    try {
      console.log('deleteAllWorkingHours');
      const response = await DELETE(API_ENDPOINTS.DELETE_ALL_WORKING_HOURS);
      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to delete working hours.');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete working hours. Please try again.';
      throw new Error(errorMessage);
    }
  }
}

export const providerWorkingHoursService = new ProviderWorkingHours();
