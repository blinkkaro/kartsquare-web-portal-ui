import { AuthResponse, LoginCredentials, RegisterData } from "./auth.interface";
import { API_ENDPOINTS } from "./apiEndPoint";
import api from "../api";
import { logout, setCredentials } from "@/features/ui/authSlice";
import { store } from "@/store/store";
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
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
    } finally {
      store.dispatch(logout());
    }
  }
}

export const authService = new AuthService();
