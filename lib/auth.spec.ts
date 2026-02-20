/**
 * Unit tests for auth utilities (cookie-based)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "bun:test";
import * as auth from "./auth";

describe("auth (cookie-based)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    // Mock fetch for all tests
    globalThis.fetch = vi.fn();
    // Reset document.cookie if needed
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.resetAllMocks();
  });

  describe("register", () => {
    it("calls the API and returns user data", async () => {
      const mockResponse = { id: 1, email: "test@example.com" };
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await auth.register({
        restaurantName: "Test Restaurant",
        email: "test@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/register"),
        expect.objectContaining({ credentials: "include" })
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws error when registration fails", async () => {
      (fetch as any).mockResolvedValue({ ok: false });

      await expect(
        auth.register({
          restaurantName: "Test",
          email: "fail@example.com",
          password: "123",
          firstName: "Fail",
          lastName: "Case",
        })
      ).rejects.toThrow("Registration failed");
    });
  });

  describe("login", () => {
    it("logs in successfully and returns user info", async () => {
      const mockResponse = { id: 1, email: "test@example.com" };
      (fetch as any).mockResolvedValue({ ok: true, json: async () => mockResponse });

      const result = await auth.login("test@example.com", "password123");
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({ credentials: "include" })
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws error when login fails", async () => {
      (fetch as any).mockResolvedValue({ ok: false });
      await expect(auth.login("fail@example.com", "123")).rejects.toThrow("Login failed");
    });
  });

  describe("logout", () => {
    it("calls logout API and redirects", async () => {
      // Mock fetch
      (globalThis.fetch as any) = vi.fn().mockResolvedValue({ ok: true });

      // Replace window.location with a writable mock
      const originalLocation = window.location;
      delete (window as any).location;
      (window as any).location = { href: "" };

      // Call logout
      await auth.logout();

      // API should be called
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/logout"),
        expect.objectContaining({ method: "POST", credentials: "include" })
      );

      // Check redirect
      expect(window.location.href).toBe("/login");

      // Restore original location
      (window as any).location = originalLocation;
    });
  });

  describe("getUser", () => {
    it("returns null when fetch fails", async () => {
      (fetch as any).mockResolvedValue({ ok: false });
      const result = await auth.getUser();
      expect(result).toBeNull();
    });

    it("returns user info when fetch succeeds", async () => {
      const mockUser = { id: 1, email: "test@example.com" };
      (fetch as any).mockResolvedValue({ ok: true, json: async () => mockUser });

      const result = await auth.getUser();
      expect(result).toEqual(mockUser);
    });
  });
});