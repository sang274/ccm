//src/services/walletService.ts
import { apiClient } from './api';

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  asset: string;
  createdAt: string;
  metadata?: any;
}

export interface Wallet {
  id: string;
  userId: string;
  fiatBalance: number;
  carbonBalance: number;
  currency: string;
  updatedAt: string;
  user: {
    email: string;
    fullName?: string;
  };
  transactions: WalletTransaction[];
}


export const walletService = {
  async getAllWallets(): Promise<Wallet[]> {
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
  async getWalletTransactions(walletId: string): Promise<WalletTransaction[]> {
    const response = await apiClient.get<WalletTransaction[]>(
      `/wallet-transaction/wallet/${walletId}`
    );
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
