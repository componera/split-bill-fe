'use client';

import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
    sub: string;           // user id
    email: string;
    role: 'OWNER' | 'MANAGER' | 'STAFF';
    restaurantId: string;  // multi-tenant isolation
    exp: number;
}

export function decodeToken(token: string): JwtPayload | null {
    try {
        return jwtDecode<JwtPayload>(token);
    } catch (err) {
        console.error('Failed to decode JWT:', err);
        return null;
    }
}

/**
 * Checks if token is expired
 */
export function isTokenExpired(token: string): boolean {
    const payload = decodeToken(token);
    if (!payload) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
}

/**
 * Get restaurantId from current JWT
 */
export function getRestaurantId(): string | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    const payload = decodeToken(token);
    if (!payload) return null;

    return payload.restaurantId;
}

/**
 * Get user role from JWT
 */
export function getUserRole(): JwtPayload['role'] | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    const payload = decodeToken(token);
    return payload?.role || null;
}
