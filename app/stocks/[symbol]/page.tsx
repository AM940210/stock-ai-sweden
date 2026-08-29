import CompanyHeader from "@/components/stock/CompanyHeader";
import QuoteCard from "@/components/stock/QuoteCard";

type CompanyProfile = {
    symbol: string;
    companyName: string;
    price: number;
    change: number;
    changePercentage: number;
    exchange: string;
    industry: string;
    sector: string;
    website: string;
    image: string;
    ceo: string;
    marketCap: number;
    country: string;
};

type Quote = {
    symbol: string;
    price: number;
    change: number;
    changePercentage: number;
};

type Props = {
    params: Promise<{
        symbol: string;
    }>;
};

async function getCompany(symbol: string): Promise<CompanyProfile> {
    const res = await fetch(
        `http://localhost:3000/api/company?symbol=${encodeURIComponent(symbol)}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch company");
    }

    return res.json();
}

export default async function StockDetailsPage({
    params,
}: Props) {
    const { symbol } = await params;

    const [company, quote] = await Promise.all([
        getCompany(symbol),
        getQuote(symbol),
    ]);

    return (
        <main className="mx-auto max-w-7xl space-y-6 p-8">
            <CompanyHeader company={company} />

            <QuoteCard quote={quote} />
        </main>
    );
}

async function getQuote(symbol: string): Promise<Quote> {
    const res = await fetch(
        `http://localhost:3000/api/quote?symbol=${encodeURIComponent(symbol)}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch quote");
    }

    return res.json();
}