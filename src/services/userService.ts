// src/services/userService.ts
import { apiClient } from './api';
import { User, ApiResponse } from '../types';

// Helper function to convert role number to role name
const getRoleName = (role: number | string): string => {
  if (typeof role === 'string') return role;
  
  const roleMap: { [key: number]: string } = {
    0: 'EvOwner',
    1: 'Buyer',
    2: 'Cva',
    3: 'Admin'
  };
  
  return roleMap[role] || 'EvOwner';
};

export const userService = {
  /**
   * Get all users by role
   * GET /api/admin/users/role/{role}
   * Converts role number to role name string
   */
  async getUsersByRole(role: number | string) {
    try {
      const roleName = getRoleName(role);
      const response = await apiClient.get<ApiResponse<User[]>>(`/admin/users/role/${roleName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  },

  /**
   * Update user role
   * PUT /api/admin/users/{userId}/role
   * Converts role number to role name string
   */
  async updateUserRole(userId: string, role: number | string) {
    try {
      const roleName = getRoleName(role);
      console.log('Updating user role:', { userId, role, roleName }); // Debug log
      
      const response = await apiClient.put<ApiResponse<User>>(`/admin/users/${userId}/role`, { role: roleName });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  /**
   * Activate user account
   * PUT /api/admin/users/{userId}/activate
   */
  async activateUser(userId: string) {
    try {
      const response = await apiClient.put<ApiResponse<User>>(`/admin/users/${userId}/activate`);
      return response.data;
    } catch (error) {
      console.error('Error activating user:', error);
      throw error;
    }
  },

  /**
   * Deactivate user account
   * PUT /api/admin/users/{userId}/deactivate
   */
  async deactivateUser(userId: string) {
    try {
      const response = await apiClient.put<ApiResponse<User>>(`/admin/users/${userId}/deactivate`);
      return response.data;
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  },

  /**
   * Get all users (for admin)
   * GET /api/user (returns array directly)
   */
  async getAllUsers() {
    try {
      const response = await apiClient.get<User[]>('/user');
      console.log('Raw API response:', response); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   * GET /api/user/{userId}
   */
  async getUserById(userId: string) {
    try {
      const response = await apiClient.get<ApiResponse<User>>(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * PUT /api/user/{userId}
   */
  async updateUser(userId: string, data: Partial<User>) {
    try {
      const response = await apiClient.put<ApiResponse<User>>(`/user/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Delete user
   * DELETE /api/admin/users/{userId}
   */
  async deleteUser(userId: string) {
    try {
      const response = await apiClient.delete<ApiResponse<boolean>>(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};
