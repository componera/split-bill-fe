import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { code } = body;

    if (!code) {
        return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    try {
        // Exchange code for tokens from Square server-side
        const tokenRes = await fetch("https://connect.squareup.com/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: process.env.SQUARE_CLIENT_ID,
                client_secret: process.env.SQUARE_CLIENT_SECRET,
                code,
                grant_type: "authorization_code",
                redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/admin/pos`, // must match Square app settings
            }),
        });

        if (!tokenRes.ok) {
            const text = await tokenRes.text();
            throw new Error(text || "Failed to get Square tokens");
        }

        const tokenData = await tokenRes.json();

        // Forward to your backend to save Square tokens
        const saveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/square/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                cookie: req.headers.get("cookie") ?? "", // pass user's cookies
            },
            body: JSON.stringify({
                squareAccessToken: tokenData.access_token,
                squareMerchantId: tokenData.merchant_id,
                squareRefreshToken: tokenData.refresh_token,
                expiresAt: tokenData.expires_at,
            }),
        });

        if (!saveRes.ok) {
            const err = await saveRes.json();
            throw new Error(err.message || "Failed to save auth to backend");
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Square OAuth exchange failed:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}