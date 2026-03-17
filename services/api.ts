import { secureStorage } from "@/helper/SecureStorage";
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";
import { store } from "@/store/store";
import { openLoginModal } from "@/features/ui/loginModalSlice";
import { authService } from "./auth/auth.service";
import { logout } from "@/features/ui/authSlice";

// Create Axios instance with default config

export interface ApiResponse<T = any> {
  errors: any;
  data: T;
  message?: string;
  success: boolean;
  status: "success" | "error" | "warning" | "info" | "failed";
}

export interface CustomAxiosInstance extends AxiosInstance {
  get<T = any, R = ApiResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  delete<T = any, R = ApiResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  post<T = any, R = ApiResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  put<T = any, R = ApiResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
  patch<T = any, R = ApiResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
}

const api: CustomAxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1", // Fallback to local
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
}) as CustomAxiosInstance;

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { requiresAuth?: boolean }) => {
    // You can add auth tokens here
    const token = secureStorage.getItem("token");
    if (token && config.requiresAuth !== false) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.resolve({
        data: null,
        errors: error,
        status: "failed",
        success: false,
        message: "Authentication required",
      });
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response.data as any;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token: any) => {
            if (typeof token === "string") {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return api(originalRequest);
            }
            // It's a failure response object
            return Promise.resolve(token);
          })
          .catch((err) => {
            return Promise.resolve({
              data: null,
              errors: err,
              status: "failed",
              success: false,
              message: "Authentication required",
            } as unknown as AxiosResponse<ApiResponse>);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = secureStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw error;
        }

        const response = await authService.refreshToken(refreshToken);

        if (response.data) {
          secureStorage.setItem("token", response.data.access_token);
          secureStorage.setItem(
            "refreshToken",
            response.data.refresh_token,
          );

          // Update header
          api.defaults.headers.common["Authorization"] =
            `Bearer ${response.data.access_token}`;
          originalRequest.headers["Authorization"] =
            `Bearer ${response.data.access_token}`;

          processQueue(null, response.data.access_token);

          return api(originalRequest);
        } else {
          throw new Error("Invalid response from refresh token API");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Dispatch logout action to clear Redux state and secureStorage
        store.dispatch(logout());

        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.resolve({
          data: null,
          errors: refreshError,
          status: "failed",
          success: false,
          message: "Authentication required",
        } as unknown as AxiosResponse<ApiResponse>);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

// Wrapper methods
export const GET = async <T>(
  endpoint: string,
  params: object = {},
  requiresAuth: boolean = true,
) => {
  return await api.get<T>(endpoint, {
    params,
    requiresAuth,
  } as AxiosRequestConfig);
};

export const POST = async <T>(
  endpoint: string,
  data: object,
  params: object = {},
  requiresAuth: boolean = true,
) => {
  const config = {
    params,
    requiresAuth,
    headers: {},
  } as AxiosRequestConfig;

  if (data instanceof FormData) {
    config.headers = {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    };
  }

  return await api.post<T>(endpoint, data, config);
};

export const PUT = async <T>(
  endpoint: string,
  data: object,
  params: object = {},
  requiresAuth: boolean = true,
) => {
  const config = {
    params,
    requiresAuth,
    headers: {},
  } as AxiosRequestConfig;

  if (data instanceof FormData) {
    config.headers = {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    };
  }

  return await api.put<T>(endpoint, data, config);
};

export const PATCH = async <T>(
  endpoint: string,
  data: object,
  params: object = {},
  requiresAuth: boolean = true
) => {
  const config = {
    params,
    requiresAuth,
    headers: {},
  } as AxiosRequestConfig;

  if (data instanceof FormData) {
    config.headers = {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    };
  }

  return await api.patch<T>(endpoint, data, config);
};

export const DELETE = async <T>(
  endpoint: string,
  params: object = {},
  requiresAuth: boolean = true,
) => {
  return await api.delete<T>(endpoint, {
    params,
    requiresAuth,
  } as AxiosRequestConfig);
};

export default api;
