import CompanyHeader from "@/components/stock/CompanyHeader";

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

    const company = await getCompany(symbol);

    return (
        <main className="max-w-7xl mx-auto p-8">
            <CompanyHeader company={company} />
        </main>
    );
}