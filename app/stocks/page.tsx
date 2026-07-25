import { tr } from "zod/locales";

type Stock = {
    id: string;
    symbol: string;
    companyName: string;
    market: string;
    sector: string | null;
    industry: string | null;
    currentPrice: number | null;
    currency: string | null;
};

async function getStocks(): Promise<Stock[]> {
    const res = await fetch("http://localhost:3000/api/stocks", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch stocks");
    }

    return res.json();
}

export default async function StocksPage() {
    const stocks = await getStocks();

    return (
        <main className="max-w-7xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">
                Swedish Stocks
            </h1>

            <div className="overflow-x-auto rounded-xl border">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left">Symbol</th>
                            <th className="px-6 py-4 text-left">Company</th>
                            <th className="px-6 py-4 text-left">Market</th>
                            <th className="px-6 py-4 text-left">Sector</th>
                            <th className="px-6 py-4 text-left">Price</th>
                        </tr>
                    </thead>

                    <tbody>
                        {stocks.map((stock) => (
                            <tr
                                key={stock.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 font-semibold">
                                    {stock.symbol}
                                </td>

                                <td className="px-6 py-4">
                                    {stock.companyName}
                                </td>

                                <td className="px-6 py-4">
                                    {stock.market}
                                </td>

                                <td className="px-6 py-4">
                                    {stock.sector ?? "-"}
                                </td>

                                <td className="px-6 py-4 text-right">
                                    {stock.currentPrice ?? "-"}{" "}
                                    {stock.currency}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}