import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";
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
    process.env.NEXT_PUBLIC_API_URL || "https://api.kartsquare.com/api/v1", // Fallback to local
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
}) as CustomAxiosInstance;

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { requiresAuth?: boolean }) => {
    // You can add auth tokens here
    const token = localStorage.getItem("token");
    if (token && config.requiresAuth !== false) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

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
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          // No refresh token, logout or redirect
          throw new Error("No refresh token available");
        }

        // Import dynamically to avoid circular dependency
        const { authService } = await import("./auth/auth.service");

        // Call refresh token API
        const response = await authService.refreshToken(refreshToken);

        if (response.data && response.data.tokens) {
          localStorage.setItem("token", response.data.tokens.access_token);
          localStorage.setItem(
            "refreshToken",
            response.data.tokens.refresh_token
          );

          // Update header
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.tokens.access_token}`;
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${response.data.tokens.access_token}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Wrapper methods
export const GET = async <T>(
  endpoint: string,
  params: object = {},
  requiresAuth: boolean = true
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
  requiresAuth: boolean = true
) => {
  return await api.post<T>(endpoint, data, {
    params,
    requiresAuth,
  } as AxiosRequestConfig);
};

export const PUT = async <T>(
  endpoint: string,
  data: object,
  params: object = {},
  requiresAuth: boolean = true
) => {
  return await api.put<T>(endpoint, data, {
    params,
    requiresAuth,
  } as AxiosRequestConfig);
};

export const PATCH = async <T>(
  endpoint: string,
  data: object,
  params: object = {},
  requiresAuth: boolean = true
) => {
  return await api.patch<T>(endpoint, data, {
    params,
    requiresAuth,
  } as AxiosRequestConfig);
};

export const DELETE = async <T>(
  endpoint: string,
  params: object = {},
  requiresAuth: boolean = true
) => {
  return await api.delete<T>(endpoint, {
    params,
    requiresAuth,
  } as AxiosRequestConfig);
};

export default api;
