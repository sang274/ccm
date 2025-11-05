import { apiClient } from './api';
import { Verification, PaginatedResult } from '../types';

export const verificationService = {
  async getAll() {
    const response = await apiClient.get<Verification[]>('/verification');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Verification>(`/verification/${id}`);
    return response.data;
  },

  async getByReductionId(reductionId: string) {
    const response = await apiClient.get<Verification[]>(`/verification/reduction/${reductionId}`);
    return response.data;
  },

  async getByCvaId(cvaId: string) {
    const response = await apiClient.get<Verification[]>(`/verification/cva/${cvaId}`);
    return response.data;
  },

  async getPaginated(page: number = 1, pageSize: number = 10) {
    const response = await apiClient.get<PaginatedResult<Verification>>('/verification/paginated', { page, pageSize });
    return response.data;
  },

  async create(data: Partial<Verification>) {
    const response = await apiClient.post<Verification>('/verification', data);
    return response.data;
  },

  async update(id: string, data: Partial<Verification>) {
    const response = await apiClient.put<Verification>(`/verification/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete<boolean>(`/verification/${id}`);
    return response.data;
  },
};
