export enum UserRole {
  EvOwner = 0,
  Buyer = 1,
  Cva = 2,
  Admin = 3,
}

export enum BidStatus {
  Active = 0,
  Outbid = 1,
  Won = 2,
}

export enum CreditStatus {
  PendingVerification = 0,
  Issued = 1,
  Listed = 2,
  InAuction = 3,
  Sold = 4,
  Retired = 5,
  Cancelled = 6,
}

export enum EmissionStatus {
  Submitted = 0,
  Approved = 1,
  Rejected = 2,
}

export enum ListingStatus {
  Active = 0,
  Closed = 1,
  Cancelled = 2,
}

export enum ListingType {
  Fixed = 0,
  Auction = 1,
}

export enum PaymentStatus {
  Initiated = 0,
  Completed = 1,
  Failed = 2,
  Refunded = 3,
}

export enum RefundStatus {
  Requested = 0,
  Approved = 1,
  Rejected = 2,
  Completed = 3,
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  phone?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  batteryCapacityKWh?: number;
  metadata?: any;
  createdAt: string;
}

export interface Trip {
  id: string;
  importId: string;
  userId: string;
  vehicleId: string;
  startTime?: string;
  endTime?: string;
  distanceKm?: number;
  energyUsedKWh?: number;
  routeGeo?: any;
  createdAt: string;
}

export interface EmissionReduction {
  id: string;
  tripId: string;
  userId: string;
  reducedCO2Kg: number;
  creditsEquivalent: number;
  calculationMethod?: string;
  createdAt: string;
  status: EmissionStatus;
  cvaReviewId?: string;
  metadata?: any;
}

export interface CarbonCredit {
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

export interface Listing {
  id: string;
  creditId: string;
  sellerId: string;
  listingType: ListingType;
  unitsOffered: number;
  pricePerUnit?: number;
  currency: string;
  reservePrice?: number;
  startsAt: string;
  endsAt?: string;
  status: ListingStatus;
  createdAt: string;
  metadata?: any;
}

export interface Auction {
  id: string;
  listingId: string;
  highestBidId?: string;
  createdAt: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidAmount: number;
  bidUnits: number;
  placedAt: string;
  status: BidStatus;
}

export interface Transaction {
  id: string;
  listingId: string;
  creditId: string;
  buyerId: string;
  sellerId: string;
  units: number;
  unitPrice: number;
  totalAmount: number;
  paymentId: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  metadata?: any;
}

export interface Wallet {
  id: string;
  userId: string;
  fiatBalance: number;
  carbonBalance: number;
  currency: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: string;
  amount: number;
  asset: string;
  relatedId?: string;
  createdAt: string;
  metadata?: any;
}

export interface Verification {
  id: string;
  reductionId: string;
  cvaId: string;
  status: EmissionStatus;
  comment?: string;
  reviewedAt?: string;
  createdAt: string;
  metadata?: any;
}

export interface Certificate {
  id: string;
  transactionId: string;
  ownerId: string;
  creditId: string;
  certificateNumber: string;
  issuedAt: string;
  metadata?: any;
}

export interface PriceSuggestion {
  id: string;
  userId: string;
  creditId: string;
  suggestedPrice?: number;
  modelVersion?: string;
  createdAt: string;
  marketDataId?: number;
  metadata?: any;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string[];
}

export interface PaginatedResult<T> {
  items: T[];
  totalResults: number;
  page: number;
  pageSize: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  fullName: string;
  phone: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}
