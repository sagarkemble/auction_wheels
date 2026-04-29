export type UserRole = 'admin' | 'vendor' | 'seller' | 'buyer';

export type AuctionStatus = 'pending' | 'approved' | 'live' | 'completed' | 'cancelled';

export type VehicleCategory = '2_WHEELER' | '4_WHEELER' | 'COMMERCIAL';

export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor';

export type Transmission = 'manual' | 'automatic' | 'semi-automatic';

export type KYCStatus = 'pending' | 'approved' | 'rejected';

export type TicketStatus = 'active' | 'cancelled' | 'used';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  address: string;
  profilePhoto?: string;
  createdAt: string;

  // Vendor specific
  businessName?: string;
  kycDocuments?: {
    shopLicense?: string;
    governmentId?: string;
  };
  auctionPolicies?: string;
  rating?: number;
  kycStatus?: KYCStatus;

  // Buyer specific
  registeredAuctions?: string[];
  wishlist?: string[];
  interestedVehicles?: string[];

  // Seller specific
  listedVehicles?: string[];
}

export interface Auction {
  id: string;
  vendorId: string;
  title: string;
  description: string;
  city: string;
  venue: string;
  address: string;
  date: string;
  time: string;
  status: AuctionStatus;
  vehicleLimit: number;
  vehicleCount: number;
  buyerFee: number;
  sellerFee: number;
  rules: string;
  registeredBuyers: string[];
  registeredSellers: string[];
  vehicles: string[];
  createdAt: string;
}

export interface Vehicle {
  id: string;
  sellerId: string;
  auctionId: string;
  category: VehicleCategory;
  type: string;
  fuelType: string;
  transmission: Transmission;
  make: string;
  model: string;
  year: number;
  color: string;
  odometer: number;
  purchaseDate: string;
  condition: VehicleCondition;
  photos: string[];
  description: string;
  basePrice: number;
  interestedBuyers: string[];
  createdAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  auctionId: string;
  role: 'buyer' | 'seller';
  status: TicketStatus;
  amount: number;
  transactionId: string;
  createdAt: string;
}

export interface RefundRequest {
  id: string;
  userId: string;
  auctionId: string;
  ticketId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  adminResponse?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}
