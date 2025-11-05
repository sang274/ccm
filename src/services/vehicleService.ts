import { apiClient } from './api';
import { Vehicle, PaginatedResult } from '../types';

export const vehicleService = {
  async getAll() {
    const response = await apiClient.get<Vehicle[]>('/vehicle');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Vehicle>(`/vehicle/${id}`);
    return response.data;
  },

  async getByUserId(userId: string) {
    const response = await apiClient.get<Vehicle[]>(`/vehicle/user/${userId}`);
    return response.data;
  },

  async getPaginated(page: number = 1, pageSize: number = 10) {
    const response = await apiClient.get<PaginatedResult<Vehicle>>('/vehicle/paginated', { page, pageSize });
    return response.data;
  },

  async create(data: Partial<Vehicle>) {
    const response = await apiClient.post<Vehicle>('/vehicle', data);
    return response.data;
  },

  async update(id: string, data: Partial<Vehicle>) {
    const response = await apiClient.put<Vehicle>(`/vehicle/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete<boolean>(`/vehicle/${id}`);
    return response.data;
  },
};
