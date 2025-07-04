import { apiRequest } from '@/lib/api';
import type { User, UpdateUserRequest } from '@/types';

export const userService = {
  // Get user profile by ID
  getUser: async (userId: number): Promise<User> => {
    const response = await apiRequest<User>({
      method: 'GET',
      url: `/users/${userId}`,
    });
    return response.data;
  },

  // Update user profile
  updateUser: async (userId: number, userData: UpdateUserRequest): Promise<User> => {
    const response = await apiRequest<User>({
      method: 'PUT',
      url: `/users/${userId}`,
      data: userData,
    });

    // Update stored user data
    if (response.success && response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  },

  // Get current user profile
  getCurrentUserProfile: async (): Promise<User> => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser.id) {
      throw new Error('No current user found');
    }
    return userService.getUser(currentUser.id);
  },

  // Update current user profile
  updateCurrentUserProfile: async (userData: UpdateUserRequest): Promise<User> => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser.id) {
      throw new Error('No current user found');
    }
    return userService.updateUser(currentUser.id, userData);
  },

  // Change password (if supported by backend)
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await apiRequest({
      method: 'PUT',
      url: '/users/change-password',
      data: {
        currentPassword,
        newPassword,
      },
    });
  },

  // Delete user account (if supported by backend)
  deleteAccount: async (userId: number): Promise<void> => {
    await apiRequest({
      method: 'DELETE',
      url: `/users/${userId}`,
    });
  },

  // Format user full name
  getFullName: (user: User): string => {
    return `${user.firstName} ${user.lastName}`.trim();
  },

  // Get user initials for avatar
  getInitials: (user: User): string => {
    const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  },
};

export default userService;