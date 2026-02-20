/**
 * Unit tests for API utilities (cookie-based)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "bun:test";
import { fetchBill, payItems, fetchStaff } from "./api";

describe("api", () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		globalThis.fetch = vi.fn();
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
		vi.resetAllMocks();
	});

	// Helper for a proper Response-like mock
	const createResponse = (ok: boolean, body: any = {}, status = ok ? 200 : 400, textBody?: string) => ({
		ok,
		status,
		statusText: ok ? "OK" : "Bad Request",
		headers: new Headers(),
		json: async () => body,
		text: async () => textBody ?? JSON.stringify(body),
	} as unknown as Response);

	// --------------------------
	// fetchBill
	// --------------------------
	describe("fetchBill", () => {
		it("returns bill data on success", async () => {
			const mockBill = { id: "bill-1", items: [] };
			(globalThis.fetch as any).mockResolvedValue(createResponse(true, mockBill));

			const result = await fetchBill("bill-1");

			expect(result).toEqual(mockBill);
			expect(globalThis.fetch).toHaveBeenCalledWith(
				expect.stringContaining("/bills/bill-1"),
				expect.objectContaining({ credentials: "include" })
			);
		});

		it("throws on failure", async () => {
			const errorMessage = "Failed to fetch bill";
			(globalThis.fetch as any).mockResolvedValue(createResponse(false, {}, 400, errorMessage));

			await expect(fetchBill("bad-id")).rejects.toThrow(errorMessage);
		});
	});

	// --------------------------
	// payItems
	// --------------------------
	describe("payItems", () => {
		it("sends correct payload and returns result", async () => {
			const mockRes = { paymentId: "p1" };
			(globalThis.fetch as any).mockResolvedValue(createResponse(true, mockRes));

			const result = await payItems("bill-1", ["item-1", "item-2"]);

			expect(result).toEqual(mockRes);
			expect(globalThis.fetch).toHaveBeenCalledWith(
				expect.stringContaining("/payments"),
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify({ billId: "bill-1", itemIds: ["item-1", "item-2"] }),
					credentials: "include",
				})
			);
		});

		it("throws on failure", async () => {
			const errorMessage = "Payment failed";
			(globalThis.fetch as any).mockResolvedValue(createResponse(false, {}, 400, errorMessage));

			await expect(payItems("bill-1", ["item-1"])).rejects.toThrow(errorMessage);
		});
	});

	// --------------------------
	// fetchStaff
	// --------------------------
	describe("fetchStaff", () => {
		it("returns users and invites on success", async () => {
			const mockData = { users: [{ id: "u1", email: "a@b.com", role: "STAFF" }], invites: [] };
			(globalThis.fetch as any).mockResolvedValue(createResponse(true, mockData));

			const result = await fetchStaff();

			expect(result).toEqual(mockData);
			expect(globalThis.fetch).toHaveBeenCalledWith(
				expect.stringContaining("/staff"),
				expect.objectContaining({ credentials: "include" })
			);
		});

		it("throws on failure", async () => {
			const errorMessage = "Failed to fetch staff";
			(globalThis.fetch as any).mockResolvedValue(createResponse(false, {}, 500, errorMessage));

			await expect(fetchStaff()).rejects.toThrow(errorMessage);
		});
	});
});