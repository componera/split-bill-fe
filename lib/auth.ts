"use client";

import { API_BASE_URL } from "./constants";

/**
 * Register a new restaurant/admin user
 * Server will set the auth cookie (HttpOnly)
 */
export async function register(data: {
    restaurantName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important to include cookies
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Registration failed");

    return res.json(); // return user info or server response
}

/**
 * Login user
 */
export async function login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    return res.json();
}

/**
 * Logout user
 * Server can clear the cookie if needed via API or just redirect
 */
export async function logout() {
    // Optional: call server to clear cookie
    await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    // Redirect to login page
    if (typeof window !== "undefined") {
        window.location.href = "/login";
    }
}

/**
 * Get current logged-in user
 * Relies on server reading cookie
 */
export async function getUser() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
    });

    if (!res.ok) return null;

    return res.json(); // server returns user info based on cookie
}