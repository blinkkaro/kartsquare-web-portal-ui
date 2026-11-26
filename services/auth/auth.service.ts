import type { SessionTokens } from "@/utils/auth";
import { GET, POST, PUT } from "../api";
import {
  type AuthResponse,
  type IGuestRegisterParams,
  type LoginCredentials,
  type RegisterData,
} from "./auth.interface";
import { API_ENDPOINTS } from "./apiEndPoint";

class AuthService {
  async login(data: LoginCredentials) {
    try {
      const response = await POST<AuthResponse>(API_ENDPOINTS.LOGIN, data, {}, false);
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
      const response = await PUT<AuthResponse>(API_ENDPOINTS.REGISTER_DETAILS, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const response = await POST<SessionTokens>(
        API_ENDPOINTS.REFRESH_TOKEN,
        {
          refreshToken,
        },
        {},
        false,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
  /** Revoke the refresh token on the backend. Never throws: signing out must work offline too. Local data is
   * cleared by `useLogout`, not here. */
  async logout(refreshToken?: string | null): Promise<void> {
    try {
      // Sending the refresh token lets the backend revoke exactly this session, even if the access token expired.
      await POST(API_ENDPOINTS.LOGOUT, refreshToken ? { refreshToken } : {}, {}, true);
    } catch {
      // The session is cleared locally regardless.
    }
  }
  async verifyOtp(data: { email: string; otp: string }) {
    try {
      const response = await POST<AuthResponse>(API_ENDPOINTS.VERIFY_OTP, data, {}, false);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(email: string) {
    try {
      const response = await POST<unknown>(API_ENDPOINTS.RESEND_OTP, { email }, {}, false);
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
      const response = await POST<AuthResponse>(API_ENDPOINTS.GUEST_REGISTER, data, {}, false);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();
