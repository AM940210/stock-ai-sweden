import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { error } from "console";
import { stockSchema } from "@/src/lib/validation/stock";

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

        // Validate required fields
        const result = stockSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    issues: result.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const data = result.data;

        // Check if the stock already exists
        const existingStock = await prisma.stock.findUnique({
            where: {
                symbol: data.symbol,
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
                symbol: data.symbol,
                companyName: data.companyName,
                market: data.market,
                sector: data.sector,
                industry: data.industry,
                currentPrice: data.currentPrice,
                currency: data.currency,
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