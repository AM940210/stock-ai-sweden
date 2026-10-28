import { PrismaClient } from "../generated/prisma";
import { parse } from "csv-parse/sync";

const prisma = new PrismaClient();

const SOURCE_URL =
    "https://raw.githubusercontent.com/adanos-software/free-ticker-database/main/data/listings.csv";


type Listing = {
    listing_key: string;
    ticker: string;
    exchange: string;
    name: string;
    asset_type: string;
    stock_sector?: string;
    country?: string;
    country_code?: string;
    isin?: string;
};

async function discoverStockholmsListings(): Promise<Listing[]> {

    console.log("Downloading stock listings...");

    const response = await fetch(SOURCE_URL);

    if (!response.ok) {
        throw new Error(
            `Dataset request failed: ${response.status} ${response.statusText}`
        );
    }

    const csv = await response.text();

    const listings = parse(csv, {
        columns: true,
        skip_empty_lines: true,
        bom: true,
        trim: true,
    }) as Listing[];

    if (listings.length === 0) {
        throw new Error(
            "The dataset returned no listing records."
        );
    }

    const stockholmStocks = listings.filter((listing) => {
        return (
            listing.exchange?.trim().toUpperCase() === "STO" &&
            listing.asset_type?.trim().toLowerCase() === "stock" &&
            Boolean(listing.ticker?.trim()) &&
            Boolean(listing.name?.trim())
        );
    });

    if (stockholmStocks.length === 0) {
        throw new Error(
            "No STO stock listings found. Database was not modified."
        );
    }

    // Prevent duplicate symbols in the downloaded source data.
    const uniqueStocks = new Map<string, Listing>();

    for (const stock of stockholmStocks) {
        const symbol = stock.ticker.trim().toUpperCase();

        if (!uniqueStocks.has(symbol)) {
            uniqueStocks.set(symbol, stock);
        }
    }

    return [...uniqueStocks.values()];
}

async function main() {
    console.log("\nNASDAQ STOCKHOLM STOCK UNIVERSE");
    console.log("================================\n");


    const stocks = await discoverStockholmsListings();

    console.log(`Discovered ${stocks.length} unique stock symbols.`);
    console.log("Synchronizing StockUnivers...\n");

    let created = 0;
    let updated = 0;

    for (const stock of stocks) {
        const symbol = stock.ticker.trim().toUpperCase();

        const existing = await prisma.stockUniverse.findUnique({
            where: { symbol },
            select: { id: true },
        });

        await prisma.stockUniverse.upsert({
            where: { symbol },

            update: {
                companyName: stock.name.trim(),
                exchange: "STO",
                market: "Nasdaq Stockholm",
                sector: stock.stock_sector?.trim() || null,
            },

            create: {
                symbol,
                companyName: stock.name.trim(),
                exchange: "STO",
                market: "Nasdaq Stockholm",
                sector: stock.stock_sector?.trim() || null,
                active: true,
            },
        });

        if (existing) {
            updated++;
        } else {
            created++;
        }

        console.log(
            `${existing ? "UPDATED" : "ADDED"} ${symbol} - {stock.name}`
        );
    }


    console.log("\n=============================");
    console.log("Stock universe synchronization complete.");
    console.log(`New stocks: ${created}`);
    console.log(`Updated stocks: ${updated}`);
    console.log(`Processed: ${created + updated}`);
}

main()
    .catch((error: unknown) => {
        console.error("\nStock universe synchronization failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });