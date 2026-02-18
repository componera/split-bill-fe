import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";


type SquareTokenResponse = {
    access_token: string;
    refresh_token?: string;
    merchant_id: string;
    expires_at?: string;
    [key: string]: any;
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { code } = req.body;
    const clientId = process.env.SQUARE_APP_ID;
    const clientSecret = process.env.SQUARE_APP_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/`;

    // Exchange code for access token
    const tokenRes = await fetch("https://connect.squareup.com/oauth2/token", {
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

    if (tokenData.access_token) {
        // Save access token to your NestJS backend
        const saveRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/square-auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "My Restaurant",
                squareAccessToken: tokenData.access_token,
                squareMerchantId: tokenData.merchant_id,
                squareRefreshToken: tokenData.refresh_token,
            }),
        });

        const savedData = await saveRes.json();
        return res.status(200).json(savedData);
    } else {
        return res.status(400).json(tokenData);
    }
}
