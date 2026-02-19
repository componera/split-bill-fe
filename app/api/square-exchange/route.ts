import { NextRequest, NextResponse } from "next/server";

// Define type for Square token response
type SquareTokenResponse = {
    access_token?: string;
    refresh_token?: string;
    merchant_id?: string;
    expires_at?: string;
    error?: string;
    [key: string]: any;
};

/**
 * POST /api/square-exchange
 * Exchanges the OAuth code from Square for an access token, then saves it to NestJS backend.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { code } = body;

        if (!code) {
            console.error("Missing OAuth code in request body");
            return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
        }

        // Use server-only secret here
        const clientId = process.env.SQUARE_APP_ID; // server-only
        const clientSecret = process.env.SQUARE_APP_SECRET; // server-only
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/admin/pos`;
        const squareAuthBaseUrl = process.env.SQUARE_BASE_URL || "https://connect.squareup.com";

        if (!clientId || !clientSecret) {
            console.error("Missing Square clientId or clientSecret");
            return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        console.log("Exchanging code for token with Square...", { code, redirectUri });

        // Exchange code for access token
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

        const tokenText = await tokenRes.text();
        let tokenData: SquareTokenResponse;

        try {
            tokenData = JSON.parse(tokenText);
        } catch (err) {
            console.error("Failed to parse Square token response:", tokenText);
            return NextResponse.json({ error: "Invalid response from Square" }, { status: 500 });
        }

        if (!tokenData.access_token) {
            console.error("Square token exchange failed:", tokenData);
            return NextResponse.json(tokenData, { status: 400 });
        }

        console.log("Square access token received:", {
            merchant_id: tokenData.merchant_id,
            expires_at: tokenData.expires_at,
        });

        // Save to NestJS backend
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend.divvytab.com";
        const saveRes = await fetch(`${backendUrl}/square/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                squareAccessToken: tokenData.access_token,
                squareRefreshToken: tokenData.refresh_token,
                squareMerchantId: tokenData.merchant_id,
                expiresAt: tokenData.expires_at,
            }),
        });

        if (!saveRes.ok) {
            const text = await saveRes.text();
            console.error("Failed to save token to backend:", text);
            return NextResponse.json({ error: "Failed to save token to backend" }, { status: 500 });
        }

        const savedData = await saveRes.json();
        console.log("Square token saved to backend:", savedData);

        return NextResponse.json(savedData);
    } catch (error) {
        console.error("Unexpected error in Square exchange:", error);
        return NextResponse.json({ error: "Square exchange failed" }, { status: 500 });
    }
}
