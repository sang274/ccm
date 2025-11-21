import { apiClient } from './api';
import { Trip } from '../types';

export const tripService = {
  async getAll(page: number = 1, pageSize: number = 20) {
    const response = await apiClient.get<Trip[]>('/trips', { page, pageSize });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Trip>(`/trips/${id}`);
    return response.data;
  },

  async create(data: Partial<Trip>) {
    const response = await apiClient.post<Trip>('/trips', data);
    return response.data;
  },

  async update(id: string, data: Partial<Trip>) {
    const response = await apiClient.put<Trip>(`/trips/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete<boolean>(`/trips/${id}`);
    return response.data;
  },
};
