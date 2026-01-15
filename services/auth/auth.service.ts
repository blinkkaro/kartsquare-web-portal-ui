import { AuthResponse, LoginCredentials, RegisterData } from "./auth.interface";
import { API_ENDPOINTS } from "./apiEndPoint";
import api from "../api";
import { POST } from "../api";

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
      const response = await POST<AuthResponse>(
        API_ENDPOINTS.REGISTER,
        data,
        {},
        false
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
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("register_step");
    } catch (error) {
      // Swallow error - logout should proceed regardless
    }
  }
}

export const authService = new AuthService();
