"use client";

import { API_BASE_URL } from "./constants";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

/**
 * Deduplicated token refresh
 * Uses httpOnly refresh cookie automatically
 */
async function refreshAccessToken(): Promise<void> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;

  refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include", // critical
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Refresh failed");
    })
    .finally(() => {
      isRefreshing = false;
    });

  return refreshPromise;
}

/**
 * Authenticated fetch using cookies only.
 * No Authorization header needed.
 */
export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    credentials: "include", // always include cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    try {
      await refreshAccessToken();

      // Retry original request after refresh
      res = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });
    } catch {
      // Optional: redirect to login
      window.location.href = "/login";
      throw new Error("Session expired");
    }
  }

  return res;
}
