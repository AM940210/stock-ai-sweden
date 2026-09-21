import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const symbol = request.nextUrl.searchParams.get("symbol");

    if (!symbol) {
        return NextResponse.json(
            { error: "Missing symbol" },
            { status: 400 }
        );
    }

    const apiToken = process.env.MARKETAUX_API_TOKEN;

    if (!apiToken) {
        return NextResponse.json(
            { error: "Marketaux API token is not configured" },
            { status: 500 }
        );
    }

    try {

        const params = new URLSearchParams({
            symbols: symbol,
            filter_entities: "true",
            language: "en",
            limit: "10",
            api_token: apiToken,
        });

        const response = await fetch(
            `https://api.marketaux.com/v1/news/all?${params.toString()}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            const text = await response.text();

            return NextResponse.json(
                {
                    error: "Marketaux news request failed",
                    status: response.status,
                    details: text,
                },
                { status: response.status }
            );
        }

        const result = await response.json();

        return NextResponse.json(result.data ?? []);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch stock news" },
            { status: 500 }
        );
    }
}