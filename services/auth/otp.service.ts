import api from '../api';
import { API_ENDPOINTS } from './apiEndPoint';

interface OTPResponse {
  success: boolean;
  data: number;
  message: string;
}
class OtpService {
  async verifyOtp(otp: string): Promise<boolean> {
    try {
      const response = await api.post<OTPResponse>(
        API_ENDPOINTS.VERIFY_OTP,
        { otp },
      );
      console.log(response);
      if (response.status === "success") {
        return true;
      } else {
        throw new Error(response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
  async resendOTP(): Promise<boolean> {
    try {
      const response = await api.post<OTPResponse>(
        API_ENDPOINTS.RESEND_OTP,
      );
      if (response.status === "success") {
        return true;
      } else {
        throw new Error(response.message || 'Failed to send otp');
      }
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
}

export const otpService = new OtpService();
