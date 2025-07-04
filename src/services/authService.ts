import { apiRequest, setToken, setRefreshToken, removeToken } from '@/lib/api';
import type { AuthResponse, RegisterRequest, LoginRequest, User } from '@/types';

export const authService = {
  // Register new user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>({
      method: 'POST',
      url: '/auth/register',
      data: userData,
    });

    if (response.success && response.data) {
      // Store tokens and user data
      setToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>({
      method: 'POST',
      url: '/auth/login',
      data: credentials,
    });

    if (response.success && response.data) {
      // Store tokens and user data
      setToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      // Could call logout endpoint if backend supports it
      // await apiRequest({
      //   method: 'POST',
      //   url: '/auth/logout',
      // });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local data
      removeToken();
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken: string, userId: number): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>({
      method: 'POST',
      url: '/auth/refresh-token',
      data: {
        refreshToken,
        userId,
      },
    });

    if (response.success && response.data) {
      setToken(response.data.accessToken);
      if (response.data.refreshToken) {
        setRefreshToken(response.data.refreshToken);
      }
    }

    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('accessToken');
    const user = authService.getCurrentUser();
    return !!(token && user);
  },

  // Check if current user has specific role
  hasRole: (role: string): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === role;
  },

  // Check if current user is admin
  isAdmin: (): boolean => {
    return authService.hasRole('Admin');
  },
};

export default authService;