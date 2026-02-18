import { NextRequest, NextResponse } from "next/server";

type SquareTokenResponse = {
    access_token: string;
    refresh_token?: string;
    merchant_id: string;
    expires_at?: string;
};

export async function POST(req: NextRequest) {
    const { code } = await req.json();

    if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

    // Exchange code for access token
    const res = await fetch("https://connect.squareup.com/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            client_id: process.env.NEXT_PUBLIC_SQUARE_APP_ID,
            client_secret: process.env.SQUARE_APP_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/admin/pos`,
        }),
    });

    const tokenData = (await res.json()) as SquareTokenResponse;

    if (!tokenData.access_token) {
        return NextResponse.json(tokenData, { status: 400 });
    }

    // Save the token to your backend (NestJS)
    const saveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/square-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            restaurantName: "My Restaurant", // Or get this dynamically from auth
            squareAccessToken: tokenData.access_token,
            squareRefreshToken: tokenData.refresh_token,
            squareMerchantId: tokenData.merchant_id,
            expiresAt: tokenData.expires_at,
        }),
    });

    const savedData = await saveRes.json();

    return NextResponse.json(savedData);
}
