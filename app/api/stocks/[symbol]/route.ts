import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateStockSchema } from "@/lib/validators/stock";

type RouteContext = {
    params: Promise<{
        symbol: string;
    }>;
};

export async function GET(
    request: NextRequest,
    context: RouteContext
){
    try {
        const { symbol } = await context.params;

        const stock = await prisma.stock.findUnique({
            where: {
                symbol,
            },
        });

        if (!stock) {
            return NextResponse.json(
                {
                    error: "Stock not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(stock);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}

export async function PATCH(
    request: Request,
    context: RouteContext
){
    try {
        const { symbol } = await context.params;

        const body = await request.json();

        const result = updateStockSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    issues: result.error.flatten().fieldErrors,
                },
                {
                    status: 400,
                }
            );
        }

        const existingStock = await prisma.stock.findUnique({
            where: {
                symbol,
            },
        });

        if (!existingStock) {
            return NextResponse.json(
                {
                    error: "Stock not found",
                },
                {
                    status: 404,
                }
            );
        }

        const updatedStock = await prisma.stock.update({
            where: {
                symbol,
            },
            data: result.data
        });

        return NextResponse.json(updatedStock);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(
    request: Request,
    context: RouteContext
){
    try {
        const { symbol } = await context.params;

        const existingStock = await prisma.stock.findUnique({
            where: {
                symbol,
            },
        });

        if (!existingStock) {
            return NextResponse.json(
                {
                    error: "Stock not found",
                },
                {
                    status: 404,
                }
            );
        }

        await prisma.stock.delete({
            where: {
                symbol,
            },
        });

        return NextResponse.json(
            {
                message: `Stock ${symbol} deleted successfuly.`,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}