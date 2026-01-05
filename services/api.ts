import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
// Create Axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api/v1', // Fallback to local
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth tokens here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle global errors (401, 500 etc.)
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      console.warn('Unauthorized access');
    }
    return Promise.reject(error);
  }
);

export default api;
