// /app/api/square-exchange/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json({ error: "Missing code" }, { status: 400 });
        }

        // Exchange code for Square tokens
        const tokenRes = await fetch("https://connect.squareup.com/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: process.env.SQUARE_CLIENT_ID,
                client_secret: process.env.SQUARE_CLIENT_SECRET,
                code,
                grant_type: "authorization_code",
                redirect_uri: process.env.NEXT_PUBLIC_APP_URL + "/admin/pos",
            }),
        });

        if (!tokenRes.ok) {
            const text = await tokenRes.text();
            throw new Error(text || "Failed to get Square tokens");
        }

        const tokenData = await tokenRes.json();

        // Forward tokens to your backend to save and fetch locations
        const saveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/square/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                cookie: req.headers.get("cookie") ?? "", // forward user cookies for auth
            },
            body: JSON.stringify({
                squareAccessToken: tokenData.access_token,
                squareMerchantId: tokenData.merchant_id,
                squareRefreshToken: tokenData.refresh_token,
                expiresAt: tokenData.expires_at,
            }),
        });

        if (!saveRes.ok) {
            const err = await saveRes.json().catch(() => ({ message: "Failed to save tokens" }));
            throw new Error(err.message || "Failed to save tokens to backend");
        }

        // Fetch locations from backend
        const locationsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/square/locations`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                cookie: req.headers.get("cookie") ?? "",
            },
        });

        if (!locationsRes.ok) {
            const err = await locationsRes.json().catch(() => ({ message: "Failed to fetch locations" }));
            throw new Error(err.message || "Failed to fetch locations from backend");
        }

        const locations = await locationsRes.json();

        return NextResponse.json({ success: true, locations });
    } catch (err: any) {
        console.error("Square OAuth exchange failed:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}