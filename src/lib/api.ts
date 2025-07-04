import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from '@/hooks/use-toast';

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002'; // Docker URL as default
const API_VERSION = 'api/v1';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Token management
const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

const setToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

const removeToken = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

const setRefreshToken = (token: string): void => {
  localStorage.setItem('refreshToken', token);
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (refreshToken && user.id) {
        try {
          const response = await axios.post(`${API_BASE_URL}/${API_VERSION}/auth/refresh-token`, {
            refreshToken,
            userId: user.id,
          });

          if (response.data.success) {
            const { accessToken } = response.data.data;
            setToken(accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          removeToken();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        removeToken();
        window.location.href = '/login';
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || 'Ha ocurrido un error';
    
    // Don't show toast for certain errors
    const skipToastErrors = [401, 404];
    if (!skipToastErrors.includes(error.response?.status)) {
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }

    return Promise.reject(error);
  }
);

// Standard API response interface
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Generic API request function
export const apiRequest = async <T = unknown>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await apiClient(config);
  return response.data;
};

// Export utilities
export {
  apiClient,
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  API_BASE_URL,
  API_VERSION,
};

export default apiClient;