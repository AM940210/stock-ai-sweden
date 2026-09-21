import CompanyHeader from "@/components/stock/CompanyHeader";
import PriceChart from "@/components/stock/PriceChart";
import IncomeStatement from "@/components/stock/IncomeStatement";
import type { 
    FinancialMetrics as FinancialMetricsType,
    IncomeStatementData,
    StockNews,
} from "@/lib/types";
import FinancialMetrics from "@/components/stock/FinancialMetrics";
import NewsSection from "@/components/stock/NewsSection";

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

async function getFinancialMetrics(
    symbol: string
): Promise<FinancialMetricsType> {
    const res = await fetch(
        `http://localhost:3000/api/financials/metrics?symbol=${encodeURIComponent(
            symbol
        )}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch financial metrics");
    }

    return res.json();
}

async function getNews(symbol: string): Promise<StockNews[]> {
    const res = await fetch(
        `http://localhost:3000/api/news?symbol=${encodeURIComponent(
            symbol
        )}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch news");
    }

    return res.json();
}

export default async function StockDetailsPage({
    params,
}: Props) {
    const { symbol } = await params;

    const [company, history, income, metrics, news] = await Promise.all([
        getCompany(symbol),
        getHistoricalPrices(symbol),
        getIncomeStatement(symbol),
        getFinancialMetrics(symbol),
        getNews(symbol),
    ]);

    return (
        <main className="mx-auto max-w-7xl space-y-6 p-8">
            <CompanyHeader company={company} />

            <PriceChart data={history} />

            <IncomeStatement data={income} />

            <FinancialMetrics data={metrics} />

            <NewsSection data={news} />
        </main>
    );
}

