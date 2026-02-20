'use client';
import { API_BASE_URL } from '@/lib/constants';
import { create } from 'zustand';

export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF';

export interface CurrentUser {
    id: string;
    email: string;
    role: UserRole;
    restaurantId: string;
}

interface UserStore {
    user: CurrentUser | null;
    setUser: (user: CurrentUser | null) => void;
    refreshUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),

    /**
     * Fetch the current user from the server using the cookie-based auth
     */
    refreshUser: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' });
            if (!res.ok) {
                set({ user: null });
                return;
            }
            const user: CurrentUser = await res.json();
            set({ user });
        } catch {
            set({ user: null });
        }
    },
}));