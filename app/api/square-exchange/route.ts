// /api/square-exchange/route.ts
import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

type SquareTokenResponse = {
    access_token?: string;
    refresh_token?: string;
    merchant_id?: string;
    expires_at?: string;
    [key: string]: any;
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code } = body;

        if (!code) {
            console.error("No authorization code received in body:", body);
            return NextResponse.json(
                { error: "Missing authorization code" },
                { status: 400 }
            );
        }

        const clientId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
        const clientSecret = process.env.SQUARE_APP_SECRET;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/admin/pos`;
        const squareAuthBaseUrl = process.env.NEXT_PUBLIC_SQUARE_BASE_URL;

        // Step 1: Exchange code for access token with Square
        const tokenRes = await fetch(`${squareAuthBaseUrl}/oauth2/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                grant_type: "authorization_code",
                redirect_uri: redirectUri,
            }),
        });

        const tokenData: SquareTokenResponse = await tokenRes.json();

        if (!tokenRes.ok || !tokenData.access_token) {
            console.error("Square token exchange failed:", {
                status: tokenRes.status,
                body: tokenData,
            });
            return NextResponse.json(
                { error: "Square token exchange failed", details: tokenData },
                { status: tokenRes.status }
            );
        }

        console.log("Square auth token received:", tokenData);

        // Step 2: Save to NestJS backend
        const saveRes = await apiFetch("/square/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                squareAccessToken: tokenData.access_token,
                squareMerchantId: tokenData.merchant_id,
                squareRefreshToken: tokenData.refresh_token,
                expiresAt: tokenData.expires_at,
            }),
        });

        if (!saveRes.ok) {
            const errText = await saveRes.text();
            console.error("NestJS save failed:", { status: saveRes.status, body: errText });
            return NextResponse.json(
                { error: "Failed to save Square auth to backend", details: errText },
                { status: 500 }
            );
        }

        const savedData = await saveRes.json();
        console.log("Square auth saved to backend:", savedData);

        return NextResponse.json(savedData);
    } catch (error) {
        console.error("Unexpected error in /api/square-exchange:", error);
        return NextResponse.json(
            { error: "Square exchange failed", details: error },
            { status: 500 }
        );
    }
}
