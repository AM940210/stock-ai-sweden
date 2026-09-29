import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const symbol = request.nextUrl.searchParams.get("symbol");

    if (!symbol) {
        return NextResponse.json(
            { error: "Missing symbol" },
            { status: 400 }
        );
    }

    const normalizedSymbol = symbol.toUpperCase();

    try {
        // 1. Find the newest cached price
        const latestCachedPrice =
            await prisma.historicalPrice.findFirst({
                where: {
                    symbol: normalizedSymbol,
                },
                orderBy: {
                    date: "desc",
                },
            });

        // 2. If we have cached data, check whether it is recent
        if (latestCachedPrice) {
            const latestDate = new Date(
                latestCachedPrice.date
            );

            const now = new Date();

            const isSameDay =
                latestDate.getUTCFullYear() ===
                    now.getUTCFullYear() &&
                latestDate.getUTCMonth() ===
                    now.getUTCMonth() &&
                latestDate.getUTCDate() ===
                    now.getUTCDate();

            if (isSameDay) {
                const cachedPrices =
                    await prisma.historicalPrice.findMany({
                        where: {
                            symbol: normalizedSymbol,
                        },
                        orderBy: {
                            date: "desc",
                        },
                    });

                return NextResponse.json(cachedPrices);
            }
        }

        // 3. Cached data is missing or outdated fetch FMP
        const response = await fetch(
            `https://financialmodelingprep.com/stable/historical-price-eod/full?symbol=${encodeURIComponent(
                normalizedSymbol
            )}&apikey=${process.env.FMP_API_KEY}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            const text = await response.text();

            console.error(
                "FMP hitorical price error",
                response.status,
                text
            );

            // If we already have cached data, use it as fallback
            if (latestCachedPrice) {
                const cachedPrices =
                    await prisma.historicalPrice.findMany({
                        where: {
                            symbol: normalizedSymbol,
                        },
                        orderBy: {
                            date: "desc",
                        },
                    });

                return NextResponse.json(cachedPrices);
            }

            return NextResponse.json(
                {
                    error: "FMP historical price request failed",
                    status: response.status,
                    details: text,
                },
                {
                    status: response.status,
                }
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            return NextResponse.json(
                {
                    error: "Invalid historical price response",
                },
                {
                    status: 500,
                }
            );
        }

        // 4. Save/update historical prices
        await prisma.historicalPrice.createMany({
            data: data.map((item) => ({
                symbol: normalizedSymbol,
                date: new Date(item.date),

                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume,

                change: item.change ?? null,
                changePercent: item.changePercent ?? null,
                vwap: item.vwap ?? null,
            })),
            skipDuplicates: true,
        });

        // 5. Return updated database data
        const updatedPrices =
            await prisma.historicalPrice.findMany({
                where: {
                    symbol: normalizedSymbol,
                },
                orderBy: {
                    date: "desc",
                },
            });

        return NextResponse.json(updatedPrices);
    } catch (error) {
        console.error(
            "Historical price route error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to fetch historical prices",
            },
            {
                status: 500,
            }
        );
    }
}