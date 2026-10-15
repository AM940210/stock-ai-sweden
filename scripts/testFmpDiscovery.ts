import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(process.cwd(), ".env.local"),
});

async function main() {
    const apiKey = process.env.FMP_API_KEY;

    if (!apiKey) {
        throw new Error("FMP_API_KEY is missing from .env.local");
    }

    const url = new URL(
        "https://financialmodelingprep.com/stable/stock-list"
    );

    url.searchParams.set("apikey", apiKey);

    console.log("Testing FMP stock-list endpoint...");

    const response = await fetch(url);

    if (!response.ok) {
        console.error("HTTP status:", response.status);
        console.error("Response:", await response.text());

        return;
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
        console.error("Unexpected response format.");
        return;
    }

    console.log("FMP stock list is accessible.");
    console.log("Total returned:", data.length);
    console.log("Sample:", data.slice(0, 5));
}

main().catch(console.error);