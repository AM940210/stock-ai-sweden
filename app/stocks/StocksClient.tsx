"use client";

import { useMemo, useState } from "react";

import type { Stock } from "@/lib/types";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StockTable from "@/components/dashboard/StockTable";
import SearchBar from "@/components/dashboard/SearchBar";
import StatsCards from "@/components/dashboard/StatsCards";

type Props = {
    stocks: Stock[];
};

export default function StocksClient({
    stocks,
}: Props) {
    const [search, setSearch] = useState("");

    const filteredStocks = useMemo(() => {
        const value = search.toLowerCase();

        return stocks.filter((stock) =>
            stock.symbol.toLowerCase().includes(value) ||
            stock.companyName.toLowerCase().includes(value) ||
            stock.market.toLowerCase().includes(value)
        );
    }, [stocks, search]);

    return (
        <main className="max-w-7xl mx-auto p-8">

            <DashboardHeader />

            <SearchBar 
                value={search}
                onChange={setSearch}
            />

            <StatsCards stocks={filteredStocks} />

            <StockTable stocks={filteredStocks} />
        </main>
    )
}