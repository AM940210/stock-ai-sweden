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
            `https://financialmodelingprep.com/stable/quote?symbol=${encodeURIComponent(
                symbol
            )}&apikey=${process.env.FMP_API_KEY}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            const text = await response.text();

            return NextResponse.json(
                {
                    error: "FMP quote request failed",
                    details: text,
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json(
                { error: "Quote not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(data[0]);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch stock quote" },
            { status: 500 }
        );
    }
}