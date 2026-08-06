import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("q");

    if (!query) {
        return NextResponse.json(
            { error: "Missing search query"},
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${process.env.FINNHUB_API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch Finnhub");
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to fetch stocks" },
            { status: 500 }
        );
    }
}

console.log(process.env.FINNHUB_API_KEY);