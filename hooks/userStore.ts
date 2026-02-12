'use client';
import { create } from 'zustand';
import { JwtPayload } from '@/lib/jwt';

interface UserStore {
    user: JwtPayload | null;
    setUser: (user: JwtPayload | null) => void;
}

export const useUserStore = create<UserStore>(set => ({
    user: null,
    setUser: user => set({ user }),
}));
