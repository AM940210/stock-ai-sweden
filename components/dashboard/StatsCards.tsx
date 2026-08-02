import { Stock } from "@/lib/types";
import DashboardCard from "./DashboardCard";

type Props = {
    stocks: Stock[];
};

export default function StatsCards({
    stocks,
}: Props) {

    const averagePrice =
        stocks.length === 0
        ? 0
        : stocks.reduce(
            (sum, stock) =>
                sum + (stock.currentPrice ?? 0),
            0
        ) / stocks.length;

    return (
        <div className="grid gap-6 mb-10 md:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
                title="Total Stocks"
                value={stocks.length}
            />

            <DashboardCard 
                title="Average Price"
                value={`${averagePrice.toFixed(2)} SEK`}
            />

            <DashboardCard 
                title="Markets"
                value={
                    new Set (stocks.map((s) => s.market)).size
                }
            />

            <DashboardCard 
                title="Sectors"
                value={
                    new Set (
                        stocks.map((s) => s.sector)
                    ).size
                }
            />
        </div>
    );
}