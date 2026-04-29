import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/index';
import usersData from '../data/users.json';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: Partial<User>) => Promise<User | null>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const users = usersData as User[];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
          set({ user, isAuthenticated: true });
          return user;
        }
        return null;
      },

      register: async (userData: Partial<User>) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newUser: User = {
          id: `user_${Date.now()}`,
          role: userData.role!,
          name: userData.name!,
          email: userData.email!,
          password: userData.password!,
          phone: userData.phone!,
          city: userData.city!,
          address: userData.address!,
          profilePhoto: userData.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
          createdAt: new Date().toISOString(),
          ...(userData.role === 'vendor' && {
            businessName: userData.businessName,
            kycDocuments: userData.kycDocuments,
            auctionPolicies: userData.auctionPolicies,
            kycStatus: 'pending' as const,
          }),
          ...(userData.role === 'buyer' && {
            registeredAuctions: [],
            wishlist: [],
            interestedVehicles: [],
          }),
          ...(userData.role === 'seller' && {
            registeredAuctions: [],
            listedVehicles: [],
          }),
        };

        set({ user: newUser, isAuthenticated: true });
        return newUser;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
