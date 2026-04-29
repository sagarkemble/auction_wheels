import { VehicleCategory } from '../types';

export const VEHICLE_CATEGORIES: Record<VehicleCategory, { types: string[]; fuels: string[] }> = {
  '2_WHEELER': {
    types: ['Motorcycle', 'Scooter', 'Moped'],
    fuels: ['Petrol', 'Electric', 'CNG']
  },
  '4_WHEELER': {
    types: ['Sedan', 'SUV', 'Hatchback', 'MUV', 'Convertible'],
    fuels: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']
  },
  'COMMERCIAL': {
    types: ['Truck', 'Bus', 'Auto Rickshaw', 'Tempo', 'Mini Truck', 'Tractor'],
    fuels: ['Diesel', 'CNG', 'Electric']
  }
};

export const TRANSMISSIONS = ['Manual', 'Automatic', 'Semi-Automatic'];

export const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'];

export const CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Surat'
];

export const USER_ROLES = {
  ADMIN: 'admin',
  VENDOR: 'vendor',
  SELLER: 'seller',
  BUYER: 'buyer'
} as const;

export const AUCTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const KYC_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;
