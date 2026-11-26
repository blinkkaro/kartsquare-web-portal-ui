import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosRequestConfig,
} from "axios";
import { requestTimeoutMs, shouldRetryOnTimeout } from "@/lib/http/retry";
import { secureStorage } from "@/helper/SecureStorage";
import { persistTokens } from "@/utils/auth";
import { authService } from "./auth/auth.service";
import { API_ENDPOINTS as AUTH_API } from "./auth/apiEndPoint";

// Create Axios instance with default config

// The response shape and client methods default to `any`, as Axios's own typings do: untyped call sites
// across the app rely on it, and narrowing the defaults would be its own change.
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
  delete<T = any, R = ApiResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
  post<T = any, R = ApiResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
  put<T = any, R = ApiResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
  patch<T = any, R = ApiResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<R>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const api: CustomAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL as string,
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
    // Uploads get a long deadline; a GET that gets no answer in a few seconds is stuck, not
    // slow (the response interceptor retries it once on a fresh connection).
    config.timeout = requestTimeoutMs({
      method: config.method,
      isFormData: typeof FormData !== "undefined" && config.data instanceof FormData,
      current: config.timeout,
    });
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * The Redux store and its actions, loaded on first use. A static import made a cycle
 * (authSlice -> auth.service -> api -> store -> authSlice) that crashed server rendering of pages
 * importing the auth slice first ("Cannot access ... before initialization").
 */
const session = async () => {
  const [{ store }, { logout }, { openLoginModal }] = await Promise.all([
    import("@/store/store"),
    import("@/features/ui/authSlice"),
    import("@/features/ui/loginModalSlice"),
  ]);
  return {
    signOut: () => store.dispatch(logout()),
    askToSignIn: () => store.dispatch(openLoginModal()),
  };
};

const AUTH_ENDPOINTS_WITHOUT_REFRESH = [
  AUTH_API.LOGIN,
  AUTH_API.REFRESH_TOKEN,
  AUTH_API.LOGOUT,
  AUTH_API.FORGOT_PASSWORD,
  AUTH_API.RESET_PASSWORD,
];
const isAuthEndpoint = (url?: string): boolean =>
  !!url && AUTH_ENDPOINTS_WITHOUT_REFRESH.some((endpoint) => url.split("?")[0].endsWith(endpoint));

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
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
    return response.data as unknown as AxiosResponse;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
      _timeoutRetried?: boolean;
    };

    // No response at all (timeout / dropped connection) on a GET: retry once. The
    // first attempt may have hit a stale connection; the retry gets a fresh one.
    if (shouldRetryOnTimeout(error)) {
      originalRequest._timeoutRetried = true;
      return api(originalRequest);
    }

    // A 401 from the auth endpoints themselves is an answer (wrong password, expired refresh token, already
    // signed out), not an expired session: hand it to the caller. Refreshing here would loop, since the refresh
    // call would queue behind itself, and would pop the login modal over the login page.
    if (error.response?.status === 401 && isAuthEndpoint(originalRequest?.url)) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!secureStorage.getItem("token")) {
        (await session()).askToSignIn();
        return Promise.resolve({
          data: null,
          errors: error,
          status: "failed",
          success: false,
          message: "Authentication required",
        } as unknown as AxiosResponse<ApiResponse>);
      }
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token: unknown) => {
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
          // No refresh token — clear session and show login modal
          const { signOut, askToSignIn } = await session();
          signOut();
          askToSignIn();
          return Promise.resolve({
            data: null,
            errors: error,
            status: "failed",
            success: false,
            message: "Authentication required",
          } as unknown as AxiosResponse<ApiResponse>);
        }

        const response = await authService.refreshToken(refreshToken);
        if (response.data) {
          persistTokens(response.data);

          // Update header
          api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;
          originalRequest.headers["Authorization"] = `Bearer ${response.data.access_token}`;

          processQueue(null, response.data.access_token);

          return api(originalRequest);
        } else {
          throw new Error("Invalid response from refresh token API");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clear session and show login modal instead of redirecting
        const { signOut, askToSignIn } = await session();
        signOut();

        // Public pages (service details, home, lists) must never be yanked away
        // because a background call hit an expired session — show the login modal.
        // Only account-only areas hard-redirect to /login.
        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          const needsAuth =
            /^\/(myAccount|spr|chat|cus\/bookings|services\/[^/]+\/book)(\/|$)/.test(path);
          if (needsAuth) {
            window.location.href = "/login";
          } else {
            askToSignIn();
          }
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
