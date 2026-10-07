import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { calculateTechnicalIndicators } from "@/lib/technicalIndicators";
import { calculateStockScore } from "@/lib/stockScreener";
import type { FinancialMetrics } from "@/lib/types";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const limitParam =
            request.nextUrl.searchParams.get("limit");

        const limit = limitParam
            ? Math.min(Number(limitParam), 100)
            : 50;

        // --------------------------------
        // Get stocks that have cached
        // financial metrics
        // --------------------------------

        const cachedMetrics =
            await prisma.financialMetric.findMany({
                take: limit,
                orderBy: {
                    symbol: "asc",
                },
            });

        const results = [];

        for (const metrics of cachedMetrics) {
            const symbol = metrics.symbol;

            // --------------------------------
            // Find stock information if it
            // exists in Stock table
            // --------------------------------

            const stock =
                await prisma.stock.findUnique({
                    where: {
                        symbol,
                    },
                });

            // --------------------------------
            // Get cached historical prices
            // --------------------------------

            const history =
                await prisma.historicalPrice.findMany({
                    where: {
                        symbol,
                    },
                    orderBy: {
                        date: "asc",
                    },
                });

            // --------------------------------
            // Convert Prisma Date → string
            // --------------------------------

            const pricePoints = history.map((item) => ({
                date: item.date.toISOString(),
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume,
                change: item.change,
                changePercent: item.changePercent,
                vwap: item.vwap,
            }));

            // --------------------------------
            // Calculate technical indicators
            // --------------------------------

            let technical = null;

            if (pricePoints.length > 0) {
                const technicalData =
                    calculateTechnicalIndicators(
                        pricePoints
                    );

                const latest =
                    technicalData[
                        technicalData.length - 1
                    ];

                if (latest) {
                    technical = {
                        close: latest.close,
                        sma20: latest.sma20,
                        sma50: latest.sma50,
                        sma200: latest.sma200,
                        rsi14: latest.rsi14,
                        macd: latest.macd,
                        macdSignal: latest.macdSignal,
                    };
                }
            }

            // --------------------------------
            // Calculate InvestAI score
            // --------------------------------

            const score = calculateStockScore(
                metrics as FinancialMetrics,
                technical
            );

            results.push({
                symbol,

                companyName:
                    stock?.companyName ?? symbol,

                market:
                    stock?.market ?? "Unknown",

                sector:
                    stock?.sector ?? null,

                industry:
                    stock?.industry ?? null,

                score: score.score,

                label: score.label,

                fundamentalsScore:
                    score.fundamentalsScore,

                technicalScore:
                    score.technicalScore,

                reasons: score.reasons,

                technical,

                metrics,
            });
        }

        // --------------------------------
        // Highest score first
        // --------------------------------

        results.sort((a, b) => b.score - a.score);

        return NextResponse.json({
            count: results.length,
            results,
        });
    } catch (error) {
        console.error(
            "Screener error:",
            error
        );

        return NextResponse.json(
            {
                error: "Failed to run stock screener",
            },
            {
                status: 500,
            }
        );
    }
}