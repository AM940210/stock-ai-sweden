import CompanyHeader from "@/components/stock/CompanyHeader";
import PriceChart from "@/components/stock/PriceChart";
import IncomeStatement from "@/components/stock/IncomeStatement";
import type { IncomeStatementData } from "@/lib/types";

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


type HistoricalPrice = {
    symbol: string;
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    change: number;
    changePercent: number;
    vwap: number;
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


async function getHistoricalPrices(
    symbol: string
): Promise<HistoricalPrice[]> {
    const res = await fetch(
        `http://localhost:3000/api/history?symbol=${encodeURIComponent(symbol)}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch historical prices");
    }

    return res.json();
}

async function getIncomeStatement(
    symbol: string
): Promise<IncomeStatementData[]> {
    const res = await fetch(
        `http://localhost:3000/api/financials/income?symbol=${encodeURIComponent(
            symbol
        )}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch income statement");
    }

    return res.json();
}

export default async function StockDetailsPage({
    params,
}: Props) {
    const { symbol } = await params;

    const [company, history, income] = await Promise.all([
        getCompany(symbol),
        getHistoricalPrices(symbol),
        getIncomeStatement(symbol),
    ]);

    return (
        <main className="mx-auto max-w-7xl space-y-6 p-8">
            <CompanyHeader company={company} />

            <PriceChart data={history} />

            <IncomeStatement data={income} />
        </main>
    );
}

