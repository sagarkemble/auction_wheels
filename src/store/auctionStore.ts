import { create } from 'zustand';
import type { Auction } from '../types/index';
import auctionsData from '../data/auctions.json';

interface AuctionState {
  auctions: Auction[];
  selectedAuction: Auction | null;
  filters: {
    city: string;
    status: string;
    search: string;
  };
  setAuctions: (auctions: Auction[]) => void;
  setSelectedAuction: (auction: Auction | null) => void;
  setFilters: (filters: Partial<AuctionState['filters']>) => void;
  getAuctionById: (id: string) => Auction | undefined;
  getFilteredAuctions: () => Auction[];
  registerForAuction: (auctionId: string, userId: string, role: 'buyer' | 'seller') => void;
  createAuction: (auction: Omit<Auction, 'id' | 'createdAt'>) => Auction;
  updateAuction: (id: string, updates: Partial<Auction>) => void;
}

export const useAuctionStore = create<AuctionState>((set, get) => ({
  auctions: auctionsData as Auction[],
  selectedAuction: null,
  filters: {
    city: '',
    status: '',
    search: '',
  },

  setAuctions: (auctions) => set({ auctions }),

  setSelectedAuction: (auction) => set({ selectedAuction: auction }),

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  getAuctionById: (id) => {
    return get().auctions.find(a => a.id === id);
  },

  getFilteredAuctions: () => {
    const { auctions, filters } = get();
    return auctions.filter(auction => {
      const matchesCity = !filters.city || auction.city === filters.city;
      const matchesStatus = !filters.status || auction.status === filters.status;
      const matchesSearch = !filters.search ||
        auction.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        auction.description.toLowerCase().includes(filters.search.toLowerCase());

      return matchesCity && matchesStatus && matchesSearch;
    });
  },

  registerForAuction: (auctionId, userId, role) => {
    set((state) => ({
      auctions: state.auctions.map(auction => {
        if (auction.id === auctionId) {
          if (role === 'buyer') {
            return {
              ...auction,
              registeredBuyers: [...auction.registeredBuyers, userId],
            };
          } else {
            return {
              ...auction,
              registeredSellers: [...auction.registeredSellers, userId],
            };
          }
        }
        return auction;
      }),
    }));
  },

  createAuction: (auctionData) => {
    const newAuction: Auction = {
      ...auctionData,
      id: `auction_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      vehicleCount: 0,
      registeredBuyers: [],
      registeredSellers: [],
      vehicles: [],
    };

    set((state) => ({
      auctions: [...state.auctions, newAuction],
    }));

    return newAuction;
  },

  updateAuction: (id, updates) => {
    set((state) => ({
      auctions: state.auctions.map(auction =>
        auction.id === id ? { ...auction, ...updates } : auction
      ),
    }));
  },
}));
