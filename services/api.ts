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
}

const api: CustomAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500/api/v1", // Fallback to local
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
}) as CustomAxiosInstance;

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth tokens here
    const token = localStorage.getItem("token");
    if (token) {
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
  (error: AxiosError) => {
    // Handle global errors (401, 500 etc.)
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      console.warn("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

export default api;
