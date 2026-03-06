import { AuthResponse, IGuestRegisterParams, LoginCredentials, RegisterData } from "./auth.interface";
import { API_ENDPOINTS } from "./apiEndPoint";
import { GET, POST, PUT } from "../api";
import { secureStorage } from "@/helper/SecureStorage";

class AuthService {
  async login(data: LoginCredentials) {
    try {
      const response = await POST<AuthResponse>(
        API_ENDPOINTS.LOGIN,
        data,
        {},
        false
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async signUp(data: RegisterData) {
    try {
      // const response = await POST<AuthResponse>(
      //   API_ENDPOINTS.REGISTER,
      //   data,
      //   {},
      //   false
      // );
      const response = await PUT<AuthResponse>(
        API_ENDPOINTS.REGISTER_DETAILS,
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const response = await POST<any>(
        API_ENDPOINTS.REFRESH_TOKEN,
        {
          refreshToken,
        },
        {},
        false
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  async logout(): Promise<void> {
    try {
      await POST(API_ENDPOINTS.LOGOUT, {}, {}, true);
      secureStorage.removeItem("token");
      secureStorage.removeItem("refreshToken");
      secureStorage.removeItem("role");
      secureStorage.removeItem("register_step");
      secureStorage.removeItem("user_details");
    } catch (error) {
      // Swallow error - logout should proceed regardless
    }
  }
  async verifyOtp(data: { email: string; otp: string }) {
    try {
      const response = await POST<AuthResponse>(
        API_ENDPOINTS.VERIFY_OTP,
        data,
        {},
        false
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(email: string) {
    try {
      const response = await POST<any>(
        API_ENDPOINTS.RESEND_OTP,
        { email },
        {},
        false
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  async getRegisterDetails(): Promise<RegisterData> {
    try {
      const response = await GET<RegisterData>(API_ENDPOINTS.REGISTER_DETAILS);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async guestLogin(data: IGuestRegisterParams) {
    try {
      const response = await POST<AuthResponse>(
        API_ENDPOINTS.GUEST_REGISTER,
        data,
        {},
        false
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();
