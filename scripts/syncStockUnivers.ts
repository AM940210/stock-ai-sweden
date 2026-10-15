import dotenv from "dotenv";
import path from "path";
import { PrismaClient } from "../generated/prisma";

const envPath = path.resolve(process.cwd(), ".env");    path: path.resolve(process.cwd(), ".env"),

console.log("Loading enviroment form:", envPath)

dotenv.config({
    path: envPath,
});

const prisma = new PrismaClient();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

console.log(
    "Finnhub API key loaded:",
    Boolean(FINNHUB_API_KEY)
);

// Finnhub exchange code. we can change this if Finnhub
// uses a different code for Stockholm in your account.
const EXCHANGE = "STO";

type FinnhubStock = {
    symbol: string;
    displaySymbol?: string;
    description?: string;
    type?: string;
};

function normalizeSymbol(symbol: string): string {
    return symbol.trim().toUpperCase().replace(/\s+/g, "-");
}

async function discoverSwedishStocks(): Promise<FinnhubStock[]> {
    if (!FINNHUB_API_KEY) {
        throw new Error("FINNHUB_API_KEY is missing from .env.local or .env");
    }

    const url = new URL("https://finnhub.io/api/v1/stock/symbol");

    url.searchParams.set("exchange", EXCHANGE);
    url.searchParams.set("token", FINNHUB_API_KEY);

    console.log(`Fetching stock symbols for exchange: ${EXCHANGE}`);

    const response = await fetch(url);

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `Finnhub request failed: ${response.status} ${response.statusText}. ` +
            `Details: ${errorBody}`
        );
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
        throw new Error(
            "Finnhub returned an Unexpected response. No database changes made."
        );
    }

    return data as FinnhubStock[];
}

async function main() {
    console.log("\nSE Swedish Stock Discovery");
    console.log("===========================\n");

    // Keep Swedish listings with the .ST suffix.
    // The exchange endpoint must return the expected symbol format.
    const discoverStocks = await discoverSwedishStocks();

    const swedishStocks = discoverStocks.filter((stock) => {
        const symbol = stock.displaySymbol || stock.symbol;

        return (
            typeof symbol === "string" &&
            symbol.toUpperCase().endsWith(".ST") &&
            typeof stock.description === "string" &&
            stock.description.trim().length > 0
        );
    });

    if (swedishStocks.length === 0) {
        throw new Error(
            "No Swedish .ST listings found. Check the Finnhub exchange code " +
                "and response before modifying the database."
        );
    }

    console.log(`Discovered ${swedishStocks.length} Swedish listings.\n`);

    let created = 0;
    let updated = 0;

    for (const stock of swedishStocks) {
        const rawSymbol = stock.displaySymbol || stock.symbol;
        const symbol = normalizeSymbol(rawSymbol);
        const companyName = stock.description!.trim();

        const existing = await prisma.stockUniverse.findUnique({
            where: { symbol },
            select: { id: true },
        });

        await prisma.stockUniverse.upsert({
            where: { symbol },

            update: {
                companyName,
                exchange: EXCHANGE,
                market: "Sweden",
                active: true
            },

            create: {
                symbol,
                companyName,
                exchange: EXCHANGE,
                market: "Sweden",
                active: true,
            },
        });

        if (existing) {
            updated++;
        } else {
            created++;
        }

        console.log(`${existing ? "🔄" : "✅"} ${symbol} - ${companyName}`);
    }

    console.log("\n=============================");
    console.log("Discovery completed!");
    console.log(`New stocks: ${created}`);
    console.log(`Updated stocks: ${updated}`);
    console.log(`Processed: ${created + updated}`);
}

main()
    .catch((error) => {
        console.error("\n❌ Stock discovery failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });