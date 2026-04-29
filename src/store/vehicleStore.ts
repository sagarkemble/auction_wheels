import { create } from 'zustand';
import type { Vehicle } from '../types/index';
import vehiclesData from '../data/vehicles.json';

interface VehicleState {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  filters: {
    category: string;
    fuelType: string;
    condition: string;
    minPrice: number;
    maxPrice: number;
    search: string;
  };
  setVehicles: (vehicles: Vehicle[]) => void;
  setSelectedVehicle: (vehicle: Vehicle | null) => void;
  setFilters: (filters: Partial<VehicleState['filters']>) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
  getVehiclesByAuction: (auctionId: string) => Vehicle[];
  getFilteredVehicles: () => Vehicle[];
  addToWishlist: (vehicleId: string, userId: string) => void;
  removeFromWishlist: (vehicleId: string, userId: string) => void;
  showInterest: (vehicleId: string, buyerId: string) => void;
  createVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'interestedBuyers'>) => Vehicle;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: vehiclesData as Vehicle[],
  selectedVehicle: null,
  filters: {
    category: '',
    fuelType: '',
    condition: '',
    minPrice: 0,
    maxPrice: 10000000,
    search: '',
  },

  setVehicles: (vehicles) => set({ vehicles }),

  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  getVehicleById: (id) => {
    return get().vehicles.find(v => v.id === id);
  },

  getVehiclesByAuction: (auctionId) => {
    return get().vehicles.filter(v => v.auctionId === auctionId);
  },

  getFilteredVehicles: () => {
    const { vehicles, filters } = get();
    return vehicles.filter(vehicle => {
      const matchesCategory = !filters.category || vehicle.category === filters.category;
      const matchesFuel = !filters.fuelType || vehicle.fuelType === filters.fuelType;
      const matchesCondition = !filters.condition || vehicle.condition === filters.condition;
      const matchesPrice = vehicle.basePrice >= filters.minPrice && vehicle.basePrice <= filters.maxPrice;
      const matchesSearch = !filters.search ||
        vehicle.make.toLowerCase().includes(filters.search.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(filters.search.toLowerCase()) ||
        vehicle.description.toLowerCase().includes(filters.search.toLowerCase());

      return matchesCategory && matchesFuel && matchesCondition && matchesPrice && matchesSearch;
    });
  },

  addToWishlist: (vehicleId, userId) => {
    // This would update the user's wishlist in the auth store
    console.log('Added to wishlist:', vehicleId, userId);
  },

  removeFromWishlist: (vehicleId, userId) => {
    console.log('Removed from wishlist:', vehicleId, userId);
  },

  showInterest: (vehicleId, buyerId) => {
    set((state) => ({
      vehicles: state.vehicles.map(vehicle => {
        if (vehicle.id === vehicleId && !vehicle.interestedBuyers.includes(buyerId)) {
          return {
            ...vehicle,
            interestedBuyers: [...vehicle.interestedBuyers, buyerId],
          };
        }
        return vehicle;
      }),
    }));
  },

  createVehicle: (vehicleData) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `vehicle_${Date.now()}`,
      createdAt: new Date().toISOString(),
      interestedBuyers: [],
    };

    set((state) => ({
      vehicles: [...state.vehicles, newVehicle],
    }));

    return newVehicle;
  },
}));
