//src/services/walletService.ts
import { apiClient } from './api';
import { Wallet, WalletTransaction } from '../types';

export const walletService = {
  async getAll() {
    const response = await apiClient.get<Wallet[]>('/wallet');
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<Wallet>(`/wallet/${id}`);
    return response.data;
  },

  async getByUserId() {
    const response = await apiClient.get<Wallet>(`/wallet/me`);
    return response.data;
  },

  async create(data: Partial<Wallet>) {
    const response = await apiClient.post<Wallet>('/wallet', data);
    return response.data;
  },

  async update(id: string, data: Partial<Wallet>) {
    const response = await apiClient.put<Wallet>(`/wallet/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete<boolean>(`/wallet/${id}`);
    return response.data;
  },
};

export const walletTransactionService = {
  async getAll() {
    const response = await apiClient.get<WalletTransaction[]>('/wallet-transaction');
    return response.data;
  },

  async getByWalletId(walletId: string) {
    const response = await apiClient.get<WalletTransaction[]>(`/wallet-transaction/wallet/${walletId}`);
    return response.data;
  },

  async getMyWallet() {
    const response = await apiClient.get<{
      success: boolean;
      data: Wallet
    }>('/api/wallet/me');

    return response.data.data; // ← trả về đúng object Wallet
  },
};
