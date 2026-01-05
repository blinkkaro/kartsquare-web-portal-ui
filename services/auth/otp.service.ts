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

      if (response.status === 200) {
        return true;
      } else {
        throw new Error(response.data.message || 'Invalid OTP');
      }
    } catch (error: any) {
      throw new Error(error.response.data.message || 'Invalid OTP');
    }
  }
  async resendOTP(): Promise<boolean> {
    try {
      const response = await api.post<OTPResponse>(
        API_ENDPOINTS.RESEND_OTP,
      );
      if (response.status === 200) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to send otp');
      }
    } catch (error: any) {
      throw new Error(error.response.data.message || 'Failed to send otp OTP');
    }
  }
}

export const otpService = new OtpService();
