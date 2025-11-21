import { apiClient } from './api';
import { Transaction } from '../types';

export const transactionService = {
  async getAll(page: number = 1, pageSize: number = 20) {
    const response = await apiClient.get<Transaction[]>('/transactions', { page, pageSize });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  async create(data: Partial<Transaction>) {
    const response = await apiClient.post<Transaction>('/transactions', data);
    return response.data;
  },

  async update(id: string, data: Partial<Transaction>) {
    const response = await apiClient.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete<boolean>(`/transactions/${id}`);
    return response.data;
  },
};
