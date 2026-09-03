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

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

function formatAxisDate(date: string, range: Range) {
    const options: Intl.DateTimeFormatOptions =
        range === "1M" || range === "3M"
            ? {
                  month: "short",
                  day: "numeric",
              }
            : {
                  month: "short",
                  year: "2-digit",
              };

    return new Intl.DateTimeFormat("en-US", options).format(
        new Date(date)
    );
}

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

        if (!data.length) {
            return [];
        }

        const latestDate = new Date(
            Math.max(
                ...data.map((item) =>
                    new Date(item.date).getTime()
                )
            )
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

    const firstPrice = chartData[0]?.price ?? 0;
    const lastPrice =
        chartData[chartData.length - 1]?.price ?? 0;

    const performance =
        firstPrice > 0
            ? ((lastPrice - firstPrice) / firstPrice) * 100
            : 0;

    const isPositive = performance >= 0;

    return (
        <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold">
                            Price History
                        </h2>

                        {chartData.length > 0 && (
                            <span
                                className={`text-sm font-semibold ${
                                    isPositive
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {isPositive ? "+" : ""}
                                {performance.toFixed(2)}%
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Historical closing price · {range}
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
                {chartData.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No historical data available.
                    </div>
                ) : (
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) =>
                                    formatAxisDate(
                                        value,
                                        range
                                    )
                                }
                                tick={{
                                    fontSize: 12,
                                }}
                                minTickGap={35}
                            />

                            <YAxis
                                domain={["auto", "auto"]}
                                tick={{
                                    fontSize: 12,
                                }}
                                tickFormatter={(value) =>
                                    `$${Number(value).toFixed(0)}`
                                }
                            />

                            <Tooltip
                                labelFormatter={(value) =>
                                    formatDate(value)
                                }
                                formatter={(value) => [
                                    `$${Number(value).toFixed(2)}`,
                                    "Close",
                                ]}
                            />

                            <Line
                                type="monotone"
                                dataKey="price"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{
                                    r: 5,
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}