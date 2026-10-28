import { parse } from "csv-parse/sync";

const SOURCE_URL =
    "https://raw.githubusercontent.com/adanos-software/free-ticker-database/main/data/listings.csv";

type Listing = {
    listing_key: string;
    ticker: string;
    exchange: string;
    name: string;
    asset_type: string;
    stock_sector: string;
    country: string;
    country_code: string;
    isin: string;
    aliases: string;
};

async function main() {
    console.log("\nNASDAQ STOCKHOLM DISCOVERY");
    console.log("==========================\n");

    console.log("Downloading public listing dataset...");

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

    console.log(`Total listing rows: ${listings.length}`);

    if (listings.length === 0) {
        throw new Error("The dataset contains no listing records.");
    }

    // Display the dataset structure.
    console.log("\nAvailable CSV colums:");
    console.log(Object.keys(listings[0]));

    // Count values for a particular filed.
    function showTopValues(
        label: string,
        values: Array<string | undefined>,
    ) {
        const counts = new Map<string, number>();

        for (const value of values) {
            const normalized = value?.trim() || "(empty)";


            counts.set(
                normalized,
                (counts.get(normalized) ?? 0) + 1
            );
        }

        console.log(`\nMost common ${label} values:`);

        console.table(
            [...counts.entries()]
                .sort((a, b) => b[1] - a[1])
                .slice(0, 30)
                .map(([value, count]) => ({
                    value,
                    count, 
                }))
        );
    }

    
    // 1. Inspect all exchange identifiers that appear related
    // to Stockholm or the Nordic markets.
    const exchangeCounts = new Map<string, number>();

    for (const listing of listings) {
        const exchange = listing.exchange?.trim().toUpperCase();

        if (!exchange) {
            continue;
        }

        exchangeCounts.set(
            exchange,
            (exchangeCounts.get(exchange) ?? 0) + 1
        );
    }

    const possibleNordicExchanges = [
        ...exchangeCounts.entries(),
    ]
        .filter(([exchange]) =>
            /STO|STOCKHOLM|NASDAQ NORDIC|NORDIC|XSTO/i.test(exchange)
        )
        .sort((a, b) => b[1] - a[1]);

    console.log("\nPossible Stockholm/Nordic exchange identifiers:");

    if (possibleNordicExchanges.length === 0) {
        console.log(
            "No matching exchange identifiers found. " +
            "Inspecting all exchange identifiers instead."
        );

        showTopValues(
            "exchange",
            listings.map((listing) => listing.exchange)
        );
    } else {
        console.table(
            possibleNordicExchanges.map(([exchange, count]) => ({
                exchange,
                count,
            }))
        );
    }

    // 2. Display the most common exchanges, country codes
    // and asset types to understand the dataset.
    showTopValues(
        "exchange",
        listings.map((listing) => listing.exchange),
    );

    showTopValues(
        "country-code",
        listings.map((listing) => listing.country_code),
    );

    showTopValues(
        "asset_type",
        listings.map((listing) => listing.asset_type),
    );

    // 3. Examine Swedish ordinary stocks.
    // This is diagnostic only: country SE does not necesserily
    // mean that a stock is listed on Nasdaq Stockholm.
    const swedishStocks = listings.filter(
        (listing) =>
            listing.country_code?.trim().toUpperCase() === "SE" &&
        listing.asset_type?.trim().toLowerCase() === "stock"
    );

    console.log(
        `\nSwedish-company stock listings: ${swedishStocks.length}`
    );

    showTopValues(
        "exchanges for Swedish-company stocks",
        swedishStocks.map((listing) => listing.exchange)
    );

    console.log("\nFirst 30 Swedish-company stock listings:");

    console.table(
        swedishStocks.slice(0, 30).map((stock) => ({
            ticker: stock.ticker,
            name: stock.name,
            exchange: stock.exchange,
            country: stock.country_code,
            sector: stock.stock_sector,
            isin: stock.isin,
        }))
    );

    // 4. Show a few listings from each possible Stockholm/Nordic
    // exchange identifier. This helps inspect actual ticker formats.
    console.log("\nSample listings from possible Stockholm/Nordic exchanges:");

    for (const [exchange] of possibleNordicExchanges) {
        const samples = listings
            .filter(
                (listing) =>
                    listing.exchange?.trim().toUpperCase() === exchange &&
                    listing.asset_type?.trim().toLowerCase() === "stock"
            )
            .slice(0, 5);

        if (samples.length === 0) {
            continue;
        }

        console.log(`\nExchange: ${exchange}`);

        console.table(
            samples.map((stock) => ({
                ticker: stock.ticker,
                name: stock.name,
                exchange: stock.exchange,
                country: stock.country_code,
                sector: stock.stock_sector,
            }))
        );
    }

    console.log("\n==========================");
    console.log("Diagnostic completed.");
    console.log("No database changes were made.");
}

main().catch((error: unknown) => {
    console.error("\n Discovery test failed:", error);
    process.exitCode = 1;
});