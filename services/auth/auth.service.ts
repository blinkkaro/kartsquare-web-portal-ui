import { AuthResponse, LoginCredentials, RegisterData } from "./auth.interface";
import { API_ENDPOINTS } from "./apiEndPoint";
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
}

export const authService = new AuthService();
