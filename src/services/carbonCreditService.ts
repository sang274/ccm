import { apiClient } from './api';
import { CarbonCredit, CreditStatus } from '../types';

export interface CarbonCreditCreateRequest {
  reductionId: string;
  ownerId: string;
  totalUnits: number;
  availableUnits: number;
  issuedAt?: string;
  retiredAt?: string;
  metadata?: any;
}

export interface CarbonCreditResponse {
  id: string;
  reductionId: string;
  ownerId: string;
  totalUnits: number;
  availableUnits: number;
  status: CreditStatus;
  issuedAt?: string;
  retiredAt?: string;
  metadata?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalResults: number;
  page: number;
  pageSize: number;
}

export const carbonCreditService = {
  async getAll(page: number = 1, pageSize: number = 10) {
    const response = await apiClient.get<PaginatedResponse<CarbonCreditResponse>>('/CarbonCredit', {
      params: { page, pageSize }
    });
    return response.data;
  },

  async getById(id: string) {
    const response = await apiClient.get<CarbonCreditResponse>(`/CarbonCredit/${id}`);
    return response.data;
  },

  async create(data: CarbonCreditCreateRequest) {
    const response = await apiClient.post<CarbonCreditResponse>('/CarbonCredit', data);
    return response.data;
  },

  async update(id: string, data: Partial<CarbonCreditCreateRequest>) {
    const response = await apiClient.put<CarbonCreditResponse>(`/CarbonCredit/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await apiClient.delete<boolean>(`/CarbonCredit/${id}`);
    return response.data;
  },

  // Helper method to create carbon credit with current user ID
  async createForCurrentUser(data: {
    reductionId: string;
    totalUnits: number;
    metadata?: any;
  }) {
    const request: CarbonCreditCreateRequest = {
      reductionId: data.reductionId,
      ownerId: '', // Will be set by the component using auth context
      totalUnits: data.totalUnits,
      availableUnits: data.totalUnits, // Initially all units are available
      issuedAt: new Date().toISOString(),
      metadata: data.metadata
    };
    return this.create(request);
  }
};
