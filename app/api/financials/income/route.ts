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
        // 1. Check database first
        const cachedStatements =
            await prisma.incomeStatement.findMany({
                where: {
                    symbol: normalizedSymbol,
                },
                orderBy: {
                    date: "desc",
                },
            });

        // Financial statements change much less frequently
        // than stock prices. Use cached data if available.
        if (cachedStatements.length > 0) {
            return NextResponse.json(cachedStatements);
        }

        // 2. No cached data request FMP
        const response = await fetch(
            `https://financialmodelingprep.com/stable/income-statement?symbol=${encodeURIComponent(
                normalizedSymbol
            )}&period=annual&limit=5&apikey=${process.env.FMP_API_KEY}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            const text = await response.text();

            console.error(
                "FMP income statement error:",
                response.status,
                text
            );

            return NextResponse.json(
                {
                    error: "FMP income statement request failed",
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
                    error: "Invalid income statement response",
                },
                { status: 404 }
            );
        }

        // 3. Save statements to PostgresSQL
        await prisma.incomeStatement.createMany({
            data: data.map((item) => ({
                symbol: normalizedSymbol,

                date: new Date(item.date),

                fiscalYear: String(
                    item.fiscalYear ?? ""
                ),

                period: String(
                    item.period ?? ""
                ),

                reportedCurrency:
                    item.reportedCurrency ?? "",

                revenue: item.revenue ?? 0,

                grossProfit:
                    item.grossProfit ?? 0,
                
                operatingIncome:
                    item.operatingIncome ?? 0,

                ebitda: item.ebitda ?? 0,

                netIncome:
                    item.netIncome ?? 0,

                epsDiluted: item.epsDiluted ?? 0,
            })),
            skipDuplicates: true,
        });

        // 4. Read from database
        const savedStatements =
            await prisma.incomeStatement.findMany({
                where: {
                    symbol: normalizedSymbol,
                },
                orderBy: {
                    date: "desc",
                },
            });

        return NextResponse.json(savedStatements);
    } catch (error) {
        console.error(
            "Income statement route error:",
            error
        );

        return NextResponse.json(
            { 
                error: "Failed to fetch income statement",
            },
            { status: 500 }
        );
    }
}