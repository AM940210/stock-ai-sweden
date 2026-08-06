import DashboardCard from "@/components/dashboard/DashboardCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import StockTable from "@/components/dashboard/StockTable";
import { Stock } from "@/lib/types";
import SearchBar from "@/components/dashboard/SearchBar";
import StocksClient from "./StocksClient";


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

    return <StocksClient stocks={stocks} />;
}