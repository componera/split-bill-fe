'use client';
import { getToken, setToken, logout } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;

  refreshPromise = fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then(async res => {
      if (!res.ok) throw new Error('Refresh failed');
      const data = await res.json();
      setToken(data.accessToken);
      return data.accessToken;
    })
    .finally(() => {
      isRefreshing = false;
    });

  return refreshPromise;
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let token = getToken();

  let res = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    try {
      token = await refreshAccessToken();
      res = await fetch(`${API_URL}${url}`, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      });
    } catch {
      logout();
      throw new Error('Session expired');
    }
  }

  return res;
}

/**
 * Fetch a single bill
 */
export async function fetchBill(billId: string) {
  const res = await apiFetch(`/bills/${billId}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch bill');

  return res.json();
}

/**
 * Pay selected items on a bill
 */
export async function payItems(billId: string, itemIds: string[]) {
  const res = await apiFetch('/payments', {
    method: 'POST',
    body: JSON.stringify({
      billId,
      itemIds,
    }),
  });

  if (!res.ok) throw new Error('Payment failed');

  return res.json();
}

