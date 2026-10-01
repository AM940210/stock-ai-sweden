import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { uuid } from "zod";
import { title } from "process";
import { Snippet } from "next/font/google";

const prisma = new PrismaClient();

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

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
        // 1. Check the newest cached article
        const latestArticle =
            await prisma.stockNews.findFirst({
                where: {
                    symbol: normalizedSymbol,
                },
                orderBy: {
                    publishedAt: "desc",
                }
            });

        // 2. Check when the news cache was last updated
        const latestCachedRecord =
            await prisma.stockNews.findFirst({
                where: {
                    symbol: normalizedSymbol,
                },
            });

        if (latestCachedRecord) {
            const cacheAge =
                Date.now() -
                latestCachedRecord.updatedAt.getTime();

            if (cacheAge < CACHE_DURATION) {
                const cachedNews =
                    await prisma.stockNews.findMany({
                        where: {
                            symbol: normalizedSymbol,
                        },
                        orderBy: {
                            publishedAt: "desc",
                        },
                        take: 10,
                    });

                return NextResponse.json(cachedNews);
            }
        }

        // 3. Cache is missing or older than 1 hour Marketaux
        const response = await fetch(
            `https://api.marketaux.com/v1/news/all?symbols=${encodeURIComponent(
                normalizedSymbol
            )}&filter_entities=true&language=en&limit=10&api_token=${process.env.MARKETAUX_API_TOKEN}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            const text = await response.text();

            console.error(
                "Marketaux news error:",
                response.status,
                text
            );

            // If we have cached news, use it as fallback
            if (latestArticle) {
                const cachedNews =
                    await prisma.stockNews.findMany({
                        where: {
                            symbol: normalizedSymbol,
                        },
                        orderBy: {
                            publishedAt: "desc",
                        },
                        take: 10,
                    });

                return NextResponse.json(cachedNews);
            }

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

        const articles = result.data ?? [];

        if (!Array.isArray(articles)) {
            return NextResponse.json(
                {
                    error: "Invalid news response",
                },
                { status: 500 }
            );
        }

        // 4. Save new articles
        await prisma.stockNews.createMany({
            data: articles.map((article: any) => ({
                uuid: article.uuid,

                symbol: normalizedSymbol,

                title: article.title,
                description:
                    article.description ?? null,
                snippet:
                    article.snippet ?? null,

                url: article.url,
                    imageUrl:
                        article.image_url ?? null,

                publishedAt:
                    new Date(article.published_at),

                source:
                    article.source ?? "Unknown",
            })),
            skipDuplicates: true,
        });

        // 5. Return the latest 10 articles from database
        const savedNews =
            await prisma.stockNews.findMany({
                where: {
                    symbol: normalizedSymbol,
                },
                orderBy: {
                    publishedAt: "desc",
                },
                take: 10,
            });

        return NextResponse.json(savedNews);
    } catch (error) {
        console.error(
            "News route error:",
            error
        );

        return NextResponse.json(
            { 
                error: "Failed to fetch stock news", 
            },
            { status: 500 }
        );
    }
}