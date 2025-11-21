import { apiClient } from './api';

export interface CreditSearchParams {
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
  region?: string;
  status?: string;
}

export interface BuyerCredit {
  id: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  region: string;
  status: string;
  description?: string;
  createdAt: string;
}

export interface PurchaseRequest {
  creditId: string;
  quantity: number;
  paymentMethod: string;
}

export interface BidRequest {
  auctionId: string;
  bidAmount: number;
}

export interface DepositRequest {
  amount: number;
  returnUrl: string;
}

export interface Transaction {
  id: string;
  creditId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  certificate?: Certificate;
}

export interface Certificate {
  id: string;
  transactionId: string;
  buyerId: string;
  creditAmount: number;
  issueDate: string;
  certificateNumber: string;
  status: string;
}

export const buyerService = {
  // Search and filter credits
  searchCredits: async (params: CreditSearchParams) => {
    const response = await apiClient.post('/buyer/search-credits', params);
    return response.data;
  },

  // Direct purchase
  buyCredit: async (request: PurchaseRequest) => {
    const response = await apiClient.post('/buyer/buy-credit', request);
    return response.data;
  },

  // Place bid in auction
  placeBid: async (request: BidRequest) => {
    const response = await apiClient.post('/buyer/place-bid', request);
    return response.data;
  },

  // Get purchase history
  getPurchaseHistory: async (buyerId: string) => {
    const response = await apiClient.get(`/buyer/purchase-history/${buyerId}`);
    return response.data;
  },

  // Get certificate
  getCertificate: async (transactionId: string) => {
    const response = await apiClient.get(`/buyer/certificate/${transactionId}`);
    return response.data;
  },

  // Deposit via VNPay
  deposit: async (request: DepositRequest) => {
    const response = await apiClient.post('/buyer/deposit', request);
    return response.data;
  },

  // Payment callback
  handlePaymentCallback: async (params: URLSearchParams) => {
    const response = await apiClient.get(`/buyer/payment/callback?${params.toString()}`);
    return response.data;
  }
};
