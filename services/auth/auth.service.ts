import { AuthResponse, LoginCredentials } from "./auth.interface";
import { API_ENDPOINTS } from "./apiEndPoint";
import api from "../api";
import { setCredentials } from "@/store/authSlice";
import { store } from "@/store/store";

class AuthService {
  async login(data: LoginCredentials) {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.LOGIN, data);

      localStorage.setItem("token", response.data.tokens.access_token);
      localStorage.setItem("refreshToken", response.data.tokens.refresh_token);

      store.dispatch(
        setCredentials({
          user: response.data.user,
          token: response.data.tokens.access_token,
          register_step: response.data.user.register_step,
        })
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();
