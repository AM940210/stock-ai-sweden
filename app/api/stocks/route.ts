import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
    const stocks = await prisma.stock.findMany({
        orderBy: {
            companyName: "asc",
        },
    });

    return NextResponse.json(stocks);
}

export async function POST(req: Request) {
    const body = await req.json();

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
}