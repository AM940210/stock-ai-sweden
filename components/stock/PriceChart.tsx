"use client";

import { useMemo, useState } from "react";
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

type Range = "1M" | "3M" | "6M" | "1Y" | "5Y" | "MAX";

const ranges: Range[] = ["1M", "3M", "6M", "1Y", "5Y", "MAX"];

export default function PriceChart({ data }: Props) {
    const [range, setRange] = useState<Range>("1Y");

    const filteredData = useMemo(() => {
        if (range === "MAX") {
            return data;
        }

        const months = {
            "1M": 1,
            "3M": 3,
            "6M": 6,
            "1Y": 12,
            "5Y": 60,
        }[range];

        const latestDate = new Date(
            Math.max(...data.map((item) => new Date(item.date).getTime()))
        );

        const startDate = new Date(latestDate);
        startDate.setMonth(startDate.getMonth() - months);

        return data.filter(
            (item) => new Date(item.date) >= startDate
        );
    }, [data, range]);

    const chartData = [...filteredData]
        .reverse()
        .map((item) => ({
            date: item.date,
            price: item.close,
        }));

    return (
        <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">
                        Price History
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Historical closing price
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {ranges.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setRange(item)}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                range === item
                                    ? "bg-primary text-primary-foreground"
                                    : "border bg-background hover:bg-muted"
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[400px] w-full">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
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