//src/services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7170/api';
console.log('API Base URL:', API_BASE_URL);

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // src/services/api.ts
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        console.log('Adding token to header:', token ? 'YES' : 'NO'); // THÊM DÒNG NÀY
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, params?: any) {
    return this.client.get<T>(url, { params });
  }

  post<T>(url: string, data?: any) {
    return this.client.post<T>(url, data);
  }

  put<T>(url: string, data?: any) {
    return this.client.put<T>(url, data);
  }

  delete<T>(url: string) {
    return this.client.delete<T>(url);
  }
}

export const apiClient = new ApiClient();
