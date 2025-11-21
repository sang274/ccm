import { apiClient } from './api';

export interface Trip {
  id: string;
  vehicleId: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  startTime: string;
  endTime: string;
  co2Reduced: number;
  status: string;
}

export interface EmissionCalculation {
  tripId: string;
  distance: number;
  co2Reduced: number;
  creditsEarned: number;
}

export interface CarbonWallet {
  balance: number;
  totalEarned: number;
  totalSold: number;
  pendingCredits: number;
}

export interface CarbonCredit {
  reductionId: string;
  ownerId: string;
  totalUnits: number;
  availableUnits: number;
  status: number;
  issuedAt: string;
  retiredAt?: string;
  metadata?: string;
}

export interface CreateCarbonCreditRequest {
  totalUnits: number;
  metadata?: string;
}

export interface Listing {
  id: string;
  sellerId: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  listingType: 'fixed' | 'auction';
  status: string;
  description?: string;
  createdAt: string;
  auctionEndTime?: string;
  minBidIncrement?: number;
}

export interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface EVOwnerReport {
  totalCO2Reduced: number;
  totalCreditsEarned: number;
  totalRevenue: number;
  totalTrips: number;
  activeListings: number;
  completedTransactions: number;
}

export interface Vehicle {
  id: string;
  userId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  batteryCapacityKWh: number;
  metadata?: string;
  createdAt: string;
}

export const evOwnerService = {
  // Add new vehicle
  addVehicle: async (vehicleData: {
    vin: string;
    make: string;
    model: string;
    year: number;
    batteryCapacityKWh: number;
  }) => {
    const response = await apiClient.post('/vehicle', vehicleData);
    return response.data;
  },

  // Get all vehicles
  getVehicles: async () => {
    const response = await apiClient.get('/vehicle');
    return response.data;
  },

  // Import trip data from file
  importTrips: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/evowner/trips/import', formData);
    return response.data;
  },

  // Calculate emission reduction
  calculateEmissions: async (tripData: { distance: number; vehicleType: string }) => {
    const response = await apiClient.post('/evowner/emissions/calculate', tripData);
    return response.data;
  },

  // Create carbon credit
  createCarbonCredit: async (data: CreateCarbonCreditRequest) => {
    const response = await apiClient.post('/CarbonCredit', data);
    return response.data;
  },

  // Get all carbon credits
  getCarbonCredits: async () => {
    const response = await apiClient.get('/CarbonCredit');
    return response.data;
  },

  // Get carbon wallet balance
  getWallet: async () => {
    const response = await apiClient.get('/evowner/wallet');
    return response.data;
  },

  // Create new listing
  createListing: async (listingData: {
    quantity: number;
    pricePerUnit?: number;
    listingType: 'fixed' | 'auction';
    description?: string;
    auctionEndTime?: string;
    minBidIncrement?: number;
    startingBid?: number;
  }) => {
    const response = await apiClient.post('/evowner/listings', listingData);
    return response.data;
  },

  // Get seller's listings
  getListings: async (page: number = 1, pageSize: number = 10) => {
    const response = await apiClient.get(`/evowner/listings?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  // Get seller's transactions
  getTransactions: async (page: number = 1, pageSize: number = 10) => {
    const response = await apiClient.get(`/evowner/transactions?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  // Cancel pending transaction
  cancelTransaction: async (transactionId: string) => {
    const response = await apiClient.post(`/evowner/transactions/${transactionId}/cancel`);
    return response.data;
  },

  // Complete transaction
  completeTransaction: async (transactionId: string) => {
    const response = await apiClient.post(`/evowner/transactions/${transactionId}/complete`);
    return response.data;
  },

  // Withdraw funds
  withdrawFunds: async (amount: number, bankAccount: string) => {
    const response = await apiClient.post('/evowner/wallet/withdraw', { amount, bankAccount });
    return response.data;
  },

  // Get personal report
  getReport: async () => {
    const response = await apiClient.get('/evowner/report');
    return response.data;
  }
};
