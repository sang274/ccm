// src/services/authService.ts
import { apiClient } from './api';
import { ApiResponse, LoginRequest, User } from '../types';

export const authService = {
  async login(credentials: LoginRequest) {
    try {
      // BƯỚC 1: Gọi login → nhận token
      const loginResponse = await apiClient.post<ApiResponse<{
        accessToken: string;
        refreshToken: string;
      }>>('/auth/login', credentials);

      console.log('Login API response:', loginResponse.data); // THÊM DÒNG NÀY

      if (!loginResponse.data.success || !loginResponse.data.data) {
        throw new Error(loginResponse.data.message || 'Login failed');
      }

      const { accessToken, refreshToken } = loginResponse.data.data;

      // BƯỚC 2: Lưu token
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // BƯỚC 3: Gọi /user/me
      const userResponse = await apiClient.get<ApiResponse<any>>('/user/me');

      console.log('User API response:', userResponse.data); // THÊM DÒNG NÀY

      if (!userResponse.data.success || !userResponse.data.data) {
        throw new Error('Không thể lấy thông tin người dùng từ /user/me');
      }

      const userData = userResponse.data.data;

      // BƯỚC 4: Lưu user
      const user: User = {
        id: '',
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        phone: userData.phone,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      };

      localStorage.setItem('user', JSON.stringify(user));
      console.log('User stored in localStorage:', localStorage.getItem('user')); // THÊM DÒNG NÀY

      return loginResponse.data;
    } catch (error: any) {
      console.error('Login error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  async register(data: {
    email: string;
    password: string;
    passwordConfirm: string;
    fullName: string;
    phone: string;
  }) {
    try {
      console.log('Register request:', data);
      
      const response = await apiClient.post<ApiResponse<any>>('/auth/register', data);
      
      console.log('Register API response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<ApiResponse<any>>('/user/me');
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        return {
          id: '',
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          phone: data.phone,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      }
      return null;
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