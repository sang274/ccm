import { apiClient } from './api';
import { ApiResponse, LoginRequest, LoginResponse, RegisterRequest, User } from '../types';

export const authService = {
  async login(credentials: LoginRequest) {
    const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/login', credentials);
    if (response.data.success && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);

      const userResponse = await this.getCurrentUser();
      if (userResponse) {
        localStorage.setItem('user', JSON.stringify(userResponse));
      }
    }
    return response.data;
  },

  async register(data: RegisterRequest) {
    const response = await apiClient.post<ApiResponse<string>>('/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<ApiResponse<User>>('/user/me');
      return response.data.data || null;
    } catch (error) {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};
