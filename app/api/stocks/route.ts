import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { error } from "console";

export async function GET() {
    const stocks = await prisma.stock.findMany({
        orderBy: {
            companyName: "asc",
        },
    });

    return NextResponse.json(stocks);
}

export async function POST(req: Request) {
    try{
        const body = await req.json();

        // Check if the stock already exists
        const existingStock = await prisma.stock.findUnique({
            where: {
                symbol: body.symbol,
            },
        });

        if (existingStock) {
            return NextResponse.json(
                {
                    error: `Stock ${body.symbol} already exists.`,
                },
                { status: 409 }
            );
        }

        const stock = await prisma.stock.create({
            data: {
                symbol: body.symbol,
                companyName: body.companyName,
                market: body.market,
                sector: body.sector,
                industry: body.industry,
                currentPrice: body.currentPrice,
                currency: body.currency,
            },
        });

        return NextResponse.json(stock, { status: 201 });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Something went wrong.",
            },
            { status: 500 }
        );
    }
}