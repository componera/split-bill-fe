import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

type SquareTokenResponse = {
    access_token: string;
    refresh_token?: string;
    merchant_id: string;
    expires_at?: string;
    [key: string]: any;
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code } = body;

        if (!code) {
            return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
        }

        // Server-side secrets only
        const clientId = process.env.SQUARE_APP_ID;          // server-only
        const clientSecret = process.env.SQUARE_APP_SECRET;  // server-
        const redirectUri = "https://www.divvytab.com/admin/pos"; // must match Square dashboard

        const cookieStore = cookies();
        const token = (await cookieStore).get("access_token")?.value;

        // 1️⃣ Exchange code for access token
        const tokenRes = await fetch("https://connect.squareup.com/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                grant_type: "authorization_code",
                redirect_uri: redirectUri,
            }),
        });

        const tokenData = (await tokenRes.json()) as SquareTokenResponse;

        if (!tokenData.access_token) {
            console.error("Square token error:", tokenData);
            return NextResponse.json(tokenData, { status: 400 });
        }

        // 2️⃣ Save auth details to NestJS backend
        const saveRes = await fetch("https://backend.divvytab.com/square/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                squareAccessToken: tokenData.access_token,
                squareMerchantId: tokenData.merchant_id,
                squareRefreshToken: tokenData.refresh_token,
                expiresAt: tokenData.expires_at,
            }),
        });

        if (!saveRes.ok) {
            const text = await saveRes.text();
            console.error("NestJS save failed:", saveRes.status, text);
            return NextResponse.json({ error: "Failed to save auth to backend", details: text }, { status: 500 });
        }

        const savedData = await saveRes.json();

        return NextResponse.json(savedData);
    } catch (error) {
        console.error("Square OAuth Error:", error);
        return NextResponse.json({ error: "Square exchange failed", details: error }, { status: 500 });
    }
}
