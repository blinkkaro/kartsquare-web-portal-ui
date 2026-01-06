import api from "../api";
import { API_ENDPOINTS } from "./apiEndPoint";

class ChangePassService {
  async forgotPassword(email: string): Promise<boolean> {
    try {
      const res = await api.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to send reset password email.");
      }
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send reset password email.";
      throw new Error(errorMessage);
    }
  }

  async resetPassword(
    email: string,
    new_password: string,
    otp: string
  ): Promise<boolean> {
    try {
      const res = await api.post(API_ENDPOINTS.RESET_PASSWORD, {
        email,
        new_password,
        otp,
      });
      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to reset password.");
      }
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password.";
      throw new Error(errorMessage);
    }
  }

  async resendOTP(email: string): Promise<void> {
    try {
      const res = await api.post(API_ENDPOINTS.RESEND_OTP, { email });
      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to resend OTP.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password.";
      throw new Error(errorMessage);
    }
  }

  async changePassword(current_password: string, new_password: string): Promise<boolean> {
    try {
      const res = await api.post(API_ENDPOINTS.CHANGE_PASSWORD, {
        current_password,
        new_password,
      });
      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to change password.");
      }
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to change password.";
      throw new Error(errorMessage);
    }
  }
}

export const changePassService = new ChangePassService();