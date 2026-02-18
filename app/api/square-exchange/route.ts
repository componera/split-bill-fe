import { NextRequest, NextResponse } from "next/server";

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
            return NextResponse.json(
                { error: "Missing authorization code" },
                { status: 400 }
            );
        }

        const clientId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
        const clientSecret = process.env.SQUARE_APP_SECRET;
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/admin/pos`;
        const squareAuthBaseUrl = process.env.NEXT_PUBLIC_SQUARE_BASE_URL;

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

        const tokenData = (await tokenRes.json()) as SquareTokenResponse;

        if (!tokenData.access_token) {
            return NextResponse.json(tokenData, { status: 400 });
        }

        // Save to NestJS backend
        const saveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/square/auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                squareAccessToken: tokenData.access_token,
                squareMerchantId: tokenData.merchant_id,
                squareRefreshToken: tokenData.refresh_token,
                expiresAt: tokenData.expires_at,
            }),
        });

        const savedData = await saveRes.json();

        return NextResponse.json(savedData);
    } catch (error) {
        console.error("Square OAuth Error:", error);

        return NextResponse.json(
            { error: "Square exchange failed" },
            { status: 500 }
        );
    }
}
