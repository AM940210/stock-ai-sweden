import { error } from "console";
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
            `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${process.env.FINNHUB_API_KEY}`
        );

        if (!response.ok) {
            const errorText = await response.text();

            console.error("Finnhub Error:", response.status, errorText);

            return NextResponse.json(
                {
                    error: "Finnhub request failed",
                    status: response.status,
                    details: errorText,
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
            { error: error instanceof Error ? error.message : "Unknown error"},
            { status: 500 }
        );
    }
}