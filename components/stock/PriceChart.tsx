"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type HistoricalPrice = {
    date: string;
    close: number;
};

type Props = {
    data: HistoricalPrice[];
};

export default function PriceChart({ data }: Props) {
    const chartData = [...data]
        .reverse()
        .map((item) => ({
            date: item.date,
            price: item.close,
        }));

    return (
        <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    Price History
                </h2>

                <p className="text-sm text-muted-foreground">
                    Historical closing price
                </p>
            </div>

            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                        />

                        <YAxis
                            domain={["auto", "auto"]}
                            tick={{ fontSize: 12 }}
                        />

                        <Tooltip
                            formatter={(value) =>
                                `$${Number(value).toFixed(2)}`
                            }
                        />

                        <Line
                            type="monotone"
                            dataKey="price"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}