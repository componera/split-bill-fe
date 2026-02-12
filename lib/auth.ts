'use client';

import { decodeToken, JwtPayload } from './jwt';

export function getToken(): string | null {
    return localStorage.getItem('accessToken');
}

export function setToken(token: string) {
    localStorage.setItem('accessToken', token);
}

export function logout() {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
}

export function getUser(): JwtPayload | null {
    const token = getToken();
    if (!token) return null;
    return decodeToken(token);
}
