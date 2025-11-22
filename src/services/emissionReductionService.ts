import { apiClient } from './api';
import { EmissionReduction, EmissionStatus } from '../types';

export const emissionReductionService = {
  async getAll(page: number = 1, pageSize: number = 10) {
    const response = await apiClient.get<EmissionReduction[]>('/EmissionReduction', {
      params: { page, pageSize }
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<EmissionReduction>(`/EmissionReduction/${id}`);
    return response.data;
  },

  async getByUserId(userId: string, page: number = 1, pageSize: number = 20) {
    try {
      const response = await apiClient.get<EmissionReduction[]>(`/EmissionReduction/user/${userId}`, {
        params: { page, pageSize }
      });
      return response.data;
    } catch {
      // Fallback if the endpoint doesn't exist
      console.warn('EmissionReduction/user endpoint not available, falling back to getAll');
      const allReductions = await this.getAll(page, pageSize);
      return allReductions;
    }
  },

  async getVerified(userId?: string) {
    try {
      const response = await apiClient.get<EmissionReduction[]>('/EmissionReduction/verified', {
        params: userId ? { userId } : {}
      });
      return response.data;
    } catch {
      // Fallback: return approved reductions from getAll
      const allReductions = await this.getAll(1, 50);
      return allReductions.filter((reduction: EmissionReduction) => 
        reduction.status === EmissionStatus.Approved && 
        (!userId || reduction.userId === userId)
      );
    }
  },

  async create(data: Partial<EmissionReduction>) {
    const response = await apiClient.post<EmissionReduction>('/EmissionReduction', data);
    return response.data;
  },

  async update(id: string, data: Partial<EmissionReduction>) {
    const response = await apiClient.put<EmissionReduction>(`/EmissionReduction/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete<boolean>(`/EmissionReduction/${id}`);
    return response.data;
  },
};