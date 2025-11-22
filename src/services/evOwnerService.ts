//src/services/evOwnerService.ts
import { apiClient } from './api';

export interface Trip {
  id: string;
  importId?: string;
  userId: string;
  vehicleId: string;
  startTime?: string;
  endTime?: string;
  distanceKm?: number;
  energyUsedKWh?: number;
  routeGeo?: any;
  createdAt: string;
}

export interface TripImport {
  id: string;
  userId: string;
  vehicleId: string;
  source?: string;
  rawFilePath?: string;
  importedAt: string;
  metadata?: any;
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
  id: string;
  reductionId: string;
  ownerId: string;
  totalUnits: number;
  availableUnits: number;
  status: number;
  issuedAt: string;
  retiredAt?: string;
  metadata?: any;
}

export interface CreateCarbonCreditRequest {
  reductionId: string;
  totalUnits: number;
  metadata?: any;
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

  // Get current user's vehicles
  getVehicles: async () => {
    const response = await apiClient.get('/vehicle/my-vehicles');
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

  // Create carbon credit - delegates to carbonCreditService
  createCarbonCredit: async (data: CreateCarbonCreditRequest) => {
    // This method is kept for backward compatibility but should use carbonCreditService directly
    const response = await apiClient.post('/CarbonCredit', {
      reductionId: data.reductionId,
      ownerId: '', // Will be set by the calling component
      totalUnits: data.totalUnits,
      availableUnits: data.totalUnits,
      issuedAt: new Date().toISOString(),
      metadata: data.metadata
    });
    return response.data;
  },

  // Get all carbon credits for current user
  getCarbonCredits: async (page: number = 1, pageSize: number = 10) => {
    const response = await apiClient.get('/CarbonCredit', {
      params: { page, pageSize }
    });
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
  withdrawFunds: async (amount: number, bankAccount: string, bankName: string) => {
    const response = await apiClient.post('/evowner/withdraw', { amount, bankAccount, bankName });
    return response.data;
  },

  // Get personal report
  getReport: async () => {
    const response = await apiClient.get('/evowner/report');
    return response.data;
  },

  // Get all trips
  getTrips: async (page = 1, pageSize = 10) => {
    const response = await apiClient.get(`/evowner/mytrips?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  // Create a new trip
  createTrip: async (tripData: {
    vehicleId: string;
    startTime?: string;
    endTime?: string;
    distanceKm?: number;
    energyUsedKWh?: number;
    routeGeo?: any;
  }) => {
    const response = await apiClient.post('/trips', tripData);
    return response.data;
  },

  // Import trips from file
  importTripsFromFile: async (file: File, vehicleId: string, source?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('vehicleId', vehicleId);
    if (source) formData.append('source', source);
    const response = await apiClient.post('/trip-imports', formData);
    return response.data;
  },

  getMyCarbonCredits: async (page = 1, pageSize = 20) => {
    const response = await apiClient.get(`/evowner/my-credits?page=${page}&pageSize=${pageSize}`);
    return response.data; // { success: true, data: { items: [...], totalResults: 45, ... } }
  },

};
