import { apiClient } from './api';
import { CarbonCredit } from '../types';

export const carbonCreditService = {
  async getAll(page: number = 1, pageSize: number = 10) {
    const response = await apiClient.get<CarbonCredit[]>('/CarbonCredit', { page, pageSize });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<CarbonCredit>(`/CarbonCredit/${id}`);
    return response.data;
  },

  async create(data: Partial<CarbonCredit>) {
    const response = await apiClient.post<CarbonCredit>('/CarbonCredit', data);
    return response.data;
  },

  async update(id: string, data: Partial<CarbonCredit>) {
    const response = await apiClient.put<CarbonCredit>(`/CarbonCredit/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete<boolean>(`/CarbonCredit/${id}`);
    return response.data;
  },
};
