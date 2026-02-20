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
      // Mock window.location.href setter
      const locationHrefSpy = vi.spyOn(window.location, "href", "set").mockImplementation(() => { });

      // Mock fetch response
      (fetch as any).mockResolvedValue({ ok: true });

      // Call logout
      await auth.logout();

      // Check fetch called correctly
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/logout"),
        expect.objectContaining({ method: "POST", credentials: "include" })
      );

      // Check redirect
      expect(locationHrefSpy).toHaveBeenCalledWith("/login");

      // Restore mock
      locationHrefSpy.mockRestore();
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