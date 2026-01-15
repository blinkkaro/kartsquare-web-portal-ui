import { GET } from '../api';
import { APIENDPOINTS } from './apiEndPoints';
import { Notification } from './notificationInterfaces';

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await GET<Notification[]>(
        APIENDPOINTS.GET_NOTIFICATIONS,
      );
      if (response.status !== 'success') {
        throw new Error(response.message || 'Failed to fetch notifications');
      }
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch notifications';
      throw new Error(errorMessage);
    }
  }
}

export const notificationService = new NotificationService();