import { th } from "zod/locales";
import type { IncomeStatementData } from "@/lib/types";

type Props = {
    data: IncomeStatementData[];
};

function formatCurrency(
    value: number,
    currency: string
) {
    const billions = value / 1_000_000_000;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 1,
    }).format(billions) + "B";
}

function formatEPS(
    value: number,
    currency: string
) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export default function IncomeStatement({
    data,
}: Props) {
    return (
        <section className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    Income Statement
                </h2>

                <p className="text-sm text-muted-foreground">
                    Annual financial results
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="px-4 py-3 text-left font-medium">
                                Metric
                            </th>

                            {data.map((item) => (
                                <th
                                    key={item.date}
                                    className="px-4 py-3 text-right font-medium"
                                >
                                    {item.fiscalYear}
                                </th>
                            ))} 
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="border-b">
                            <td className="px-4 py-3 font-medium">
                                Revenu
                            </td>

                            {data.map((item) => (
                                <td
                                    key={item.date}
                                    className="px-4 py-3 text-right"
                                >
                                    {formatCurrency(
                                        item.revenue,
                                        item.reportedCurrency
                                    )}
                                </td>
                            ))}
                        </tr>

                        <tr className="border-b">
                            <td className="px-4 py-3 font-medium">
                                Gross Profit
                            </td>

                            {data.map((item) => (
                                <td
                                    key={item.date}
                                    className="px-4 py-3 text-right"
                                >
                                    {formatCurrency(
                                        item.grossProfit,
                                        item.reportedCurrency
                                    )}
                                </td>
                            ))}
                        </tr>

                        <tr className="border-b">
                            <td className="px-4 py-3 font-medium">
                                Operating Income
                            </td>

                            {data.map((item) => (
                                <td
                                    key={item.date}
                                    className="px-4 py-3 text-right"
                                >
                                    {formatCurrency(
                                        item.operatingIncome,
                                        item.reportedCurrency
                                    )}
                                </td>
                            ))}
                        </tr>

                        <tr className="border-b">
                            <td className="px-4 py-3 font-medium">
                                EBITDA
                            </td>

                            {data.map((item) => (
                                <td
                                    key={item.date}
                                    className="px-4 py-3 text-right"
                                >
                                    {formatCurrency(
                                        item.ebitda,
                                        item.reportedCurrency
                                    )}
                                </td>
                            ))}
                        </tr>

                        <tr className="border-b">
                            <td className="px-4 py-3 font-medium">
                                Net Income
                            </td>

                            {data.map((item) => (
                                <td
                                    key={item.date}
                                    className="px-4 py-3 text-right"
                                >
                                    {formatCurrency(
                                        item.netIncome,
                                        item.reportedCurrency
                                    )}
                                </td>
                            ))}
                        </tr>

                        <tr>
                            <td className="px-4 py-3 font-medium">
                                EPS
                            </td>

                            {data.map((item) => (
                                <td
                                    key={item.date}
                                    className="px-4 py-3 text-right"
                                >
                                    {formatEPS(
                                        item.epsDiluted,
                                        item.reportedCurrency
                                    )}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
}