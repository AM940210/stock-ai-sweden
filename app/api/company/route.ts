import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const symbol = request.nextUrl.searchParams.get("symbol");

    if (!symbol) {
        return NextResponse.json(
            { error: "Missing symbol" },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            `https://financialmodelingprep.com/stable/profile?symbol=${encodeURIComponent(
                symbol
            )}&apikey=${process.env.FMP_API_KEY}`
        );

        if (!response.ok) {
            const text = await response.text();

            return NextResponse.json(
                {
                    error: "FMP request failed",
                    status: response.status,
                    details: text,
                },
                {
                    status: response.status,
                }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Failed to fetch company profile",
            },
            {
                status: 500,
            }
        );
    }
}