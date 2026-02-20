'use client';

import { apiFetch } from './api'; // uses cookies automatically

export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF';

export interface CurrentUser {
    id: string;
    email: string;
    role: UserRole;
    restaurantId: string;
}

/**
 * Fetch the currently logged-in user from the server.
 * Cookie-based auth means we read the access_token cookie automatically.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
    try {
        const user = await apiFetch<CurrentUser>('/auth/me');
        return user;
    } catch (err) {
        return null;
    }
}

/**
 * Get the current user's role
 */
export async function getUserRole(): Promise<UserRole | null> {
    const user = await getCurrentUser();
    return user?.role || null;
}

/**
 * Get current restaurantId
 */
export async function getRestaurantId(): Promise<string | null> {
    const user = await getCurrentUser();
    return user?.restaurantId || null;
}

/**
 * Check if user is authenticated (has valid cookie)
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return !!user;
}