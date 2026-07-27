import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import StockTable from "@/components/dashboard/StockTable";
import { Stock } from "@/src/lib/types";
import { tr } from "zod/locales";


async function getStocks(): Promise<Stock[]> {
    const res = await fetch(
        "http://localhost:3000/api/stocks", 
        {
        cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch stocks");
    }

    return res.json();
}

export default async function StocksPage() {
    const stocks = await getStocks();

    return (
        <main className="max-w-7xl mx-auto p-8">
            
            <DashboardHeader />

            <StatsCards stocks={stocks} />

            <StockTable stocks={stocks} />
            
        </main>
    );
}