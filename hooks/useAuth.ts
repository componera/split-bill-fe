'use client';
import { useState, useEffect } from 'react';
import { getUser, logout, setToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';

export function useAuth() {
    const [user, setUser] = useState(getUser());

    const login = async (email: string, password: string) => {
        const res = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error('Login failed');

        const data = await res.json();
        setToken(data.accessToken);
        setUser(getUser());
    };

    return { user, login, logout };
}
