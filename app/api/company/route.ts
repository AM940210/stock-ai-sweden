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
        // 1.Check database first
        const cachedProfile =
            await prisma.companyProfile.findUnique({
                where: {
                    symbol: normalizedSymbol
                },
            });

        if (cachedProfile) {
            const now = new Date();

            const age =
                now.getTime() -
                cachedProfile.updatedAt.getTime();

            const oneDay =
                24 * 60 * 60 * 1000;

            // Use cached profile if it is less than 24 hours old
            if (age < oneDay) {
                return NextResponse.json(cachedProfile);
            }
        }

        // 2. Cache is missing or outdated FMP
        const response = await fetch(
            `https://financialmodelingprep.com/stable/profile?symbol=${encodeURIComponent(
                normalizedSymbol
            )}&apikey=${process.env.FMP_API_KEY}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            const text = await response.text();

            console.error(
                "FMP company profile error:",
                response.status,
                text
            );

            // FMP failed but cached data exists
            if (cachedProfile) {
                return NextResponse.json(cachedProfile);
            }

            return NextResponse.json(
                {
                    error: "FMP request failed",
                    status: response.status,
                    details: text,
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            if (cachedProfile) {
                return NextResponse.json(cachedProfile);
            }

            return NextResponse.json(
                { error: "Company not found" },
                { status: 404 }
            );
        }

        const company = data[0];

        // 3. Save/Update database
        const savedProfile =
            await prisma.companyProfile.upsert({
                where: {
                    symbol: normalizedSymbol,
                },
                update: {
                    companyName: company.companyName,
                    price: company.price,
                    change: company.change,
                    changePercentage:
                        company.changePercentage,
                    exchange: company.exchange,
                    industry: company.industry,
                    sector: company.sector,
                    website: company.website,
                    image: company.image,
                    ceo: company.ceo,
                    marketCap: company.marketCap,
                    country: company.country,
                },
                create: {
                    symbol: normalizedSymbol,
                    companyName: company.companyName,
                    price: company.price,
                    change: company.change,
                    changePercentage:
                        company.changePercentage,
                    exchange: company.exchange,
                    industry: company.industry,
                    sector: company.sector,
                    website: company.website,
                    image: company.image,
                    ceo: company.ceo,
                    marketCap: company.marketCap,
                    country: company.country,
                },
            });

        return NextResponse.json(savedProfile);
    } catch (error) {
        console.error(
            "Company profile route error:",
            error
        );

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