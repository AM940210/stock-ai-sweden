import { Stock } from "@/src/lib/types";
import { tr } from "zod/locales";

type Props = {
    stocks: Stock[];
};

export default function StockTable({
    stocks,
}: Props) {
    return (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

            <table className="bg-gray-100">
                
                <thead>
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

                            <td className="px-6 py-4 text-right font-semibold">
                                {stock.currentPrice?.toFixed(2)}{""}
                                {stock.currency}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}