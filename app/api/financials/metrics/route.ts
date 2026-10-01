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

        // 1. Check PostgreSQL first
        const cachedMetrics =
            await prisma.financialMetric.findUnique({
                where: {
                    symbol: normalizedSymbol,
                },
            });

        if (cachedMetrics) {
            return NextResponse.json(cachedMetrics);
        }

        // 2. No cached data request FMP
        const response = await fetch(
            `https://financialmodelingprep.com/stable/ratios-ttm?symbol=${encodeURIComponent(
                symbol
            )}&apikey=${process.env.FMP_API_KEY}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            const text = await response.text();

            console.error(
                "FMP financial metrics error:",
                response.status,
                text
            );

            // Use cached data if available
            if (cachedMetrics) {
                return NextResponse.json(cachedMetrics);
            }

            return NextResponse.json(
                {
                    error: "FMP metrics request failed",
                    status: response.status,
                    details: text,
                },
                { status: response.status }
            )
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            if (cachedMetrics) {
                return NextResponse.json(cachedMetrics);
            }

            return NextResponse.json(
                { 
                    error: "Financial metrics not found", 
                },
                { status: 404 }
            );
        }

        const metrics = data[0];

        // 3. Save/update PostgreSQL
        const savedMetrics =
            await prisma.financialMetric.upsert({
                where: {
                    symbol: normalizedSymbol,
                },

                update: {
                    grossProfitMarginTTM:
                        metrics.grossProfitMarginTTM ?? null,

                    operatingProfitMarginTTM:
                        metrics.operatingProfitMarginTTM ?? null,

                    netProfitMarginTTM:
                        metrics.netProfitMarginTTM ?? null,

                    returnOnEquityTTM:
                        metrics.returnOnEquityTTM ?? null,

                    returnOnAssetsTTM:
                        metrics.returnOnAssetsTTM ?? null,

                    debtToEquityTTM:
                        metrics.debtToEquityTTM ?? null,

                    currentRatioTTM:
                        metrics.currentRatioTTM ?? null,

                    priceToEarningsRatioTTM:
                        metrics.priceToEarningsRatioTTM ?? null,

                    priceToSalesRatioTTM:
                        metrics.priceToSalesRatioTTM ?? null,

                    priceToBookRatioTTM:
                        metrics.priceToBookRatioTTM ?? null,

                    dividendYieldTTM:
                        metrics.dividendYieldTTM ?? null,
                },

                create: {
                    symbol: normalizedSymbol,

                    grossProfitMarginTTM:
                        metrics.grossProfitMarginTTM ?? null,

                    operatingProfitMarginTTM:
                        metrics.operatingProfitMarginTTM ?? null,

                    netProfitMarginTTM:
                        metrics.netProfitMarginTTM ?? null,

                    returnOnEquityTTM:
                        metrics.returnOnEquityTTM ?? null,

                    returnOnAssetsTTM:
                        metrics.returnOnAssetsTTM ?? null,

                    debtToEquityTTM:
                        metrics.debtToEquityTTM ?? null,

                    currentRatioTTM:
                        metrics.currentRatioTTM ?? null,

                    priceToEarningsRatioTTM:
                        metrics.priceToEarningsRatioTTM ?? null,

                    priceToSalesRatioTTM:
                        metrics.priceToSalesRatioTTM ?? null,

                    priceToBookRatioTTM:
                        metrics.priceToBookRatioTTM ?? null,

                    dividendYieldTTM:
                        metrics.dividendYieldTTM ?? null,
                },
            });

        return NextResponse.json(savedMetrics);
    } catch (error) {
        console.error(
            "Financial metrics route error:",
            error
        );

        return NextResponse.json(
            { 
                error: "Failed to fetch financial metrics", 
            },
            { status: 500 }
        );
    }
}