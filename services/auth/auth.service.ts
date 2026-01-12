import { AuthResponse, LoginCredentials, RegisterData } from "./auth.interface";
import { API_ENDPOINTS } from "./apiEndPoint";
import api from "../api";
import { logout, setCredentials } from "@/features/ui/authSlice";
import { store } from "@/store/store";

class AuthService {
  async login(data: LoginCredentials) {
    try {
      const response = await api.post<AuthResponse>(API_ENDPOINTS.LOGIN, data);
      console.log(response);

      if (response.status === "success") {
        localStorage.setItem("token", response.data.tokens.access_token);
        localStorage.setItem(
          "refreshToken",
          response.data.tokens.refresh_token
        );

        store.dispatch(
          setCredentials({
            user: response.data.user,
            token: response.data.tokens.access_token,
            register_step: response.data.user.register_step,
          })
        );

        return response;
      }
    } catch (error) {
      throw error;
    }
  }

  async signUp(data: RegisterData) {
    try {
      const response = await api.post<AuthResponse>(
        API_ENDPOINTS.REGISTER,
        data
      );
      if (response.status === "success") {
        localStorage.setItem("token", response.data.tokens.access_token);
        localStorage.setItem(
          "refreshToken",
          response.data.tokens.refresh_token
        );

        store.dispatch(
          setCredentials({
            user: response.data.user,
            token: response.data.tokens.access_token,
            register_step: response.data.user.register_step,
          })
        );
        return response;
      }
      throw new Error(response.data.message || "Something went wrong");
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
