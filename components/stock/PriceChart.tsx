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

import {
    calculateTechnicalIndicators,
    type PricePoint,
} from "@/lib/technicalIndicators";

type Props = {
    data: PricePoint[];
};

type Range = "1M" | "3M" | "6M" | "1Y" | "5Y" | "MAX";

const ranges: Range[] = [
    "1M",
    "3M",
    "6M",
    "1Y",
    "5Y",
    "MAX",
];

export default function PriceChart({
    data,
}: Props) {
    const [range, setRange] =
        useState<Range>("1Y");

    const [showSMA20, setShowSMA20] =
        useState(false);

    const [showSMA50, setShowSMA50] =
        useState(false);

    const [showSMA200, setShowSMA200] =
        useState(false);

    const [showEMA20, setShowEMA20] =
        useState(false);

    const [showEMA50, setShowEMA50] =
        useState(false);

    const technicalData = useMemo(
        () => calculateTechnicalIndicators(data),
        [data]
    );

    const filteredData = useMemo(() => {
        if (range === "MAX") {
            return technicalData;
        }

        const months = {
            "1M": 1,
            "3M": 3,
            "6M": 6,
            "1Y": 12,
            "5Y": 60,
        }[range];

        if (!technicalData.length) {
            return [];
        }

        const latestDate = new Date(
            Math.max(
                ...technicalData.map((item) =>
                    new Date(item.date).getTime()
                )
            )
        );

        const startDate = new Date(
            latestDate
        );

        startDate.setMonth(
            startDate.getMonth() - months
        );

        return technicalData.filter(
            (item) =>
                new Date(item.date) >=
                startDate
        );
    }, [technicalData, range]);

    const chartData = [...filteredData]
        .reverse()
        .map((item) => ({
            date: item.date,
            price: item.close,
            sma20: item.sma20,
            sma50: item.sma50,
            sma200: item.sma200,
            ema20: item.ema20,
            ema50: item.ema50,
        }));

    const firstPrice =
        chartData[0]?.price ?? 0;

    const lastPrice =
        chartData[
            chartData.length - 1
        ]?.price ?? 0;

    const performance =
        firstPrice > 0
            ? ((lastPrice - firstPrice) /
                  firstPrice) *
              100
            : 0;

    const isPositive =
        performance >= 0;

    function formatDate(date: string) {
        return new Intl.DateTimeFormat(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        ).format(new Date(date));
    }

    function formatAxisDate(date: string) {
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

        return new Intl.DateTimeFormat(
            "en-US",
            options
        ).format(new Date(date));
    }

    return (
        <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold">
                                Price History
                            </h2>

                            {chartData.length >
                                0 && (
                                <span
                                    className={`text-sm font-semibold ${
                                        isPositive
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {isPositive
                                        ? "+"
                                        : ""}
                                    {performance.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Historical closing price ·{" "}
                            {range}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {ranges.map(
                            (item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() =>
                                        setRange(
                                            item
                                        )
                                    }
                                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                        range ===
                                        item
                                            ? "bg-primary text-primary-foreground"
                                            : "border bg-background hover:bg-muted"
                                    }`}
                                >
                                    {item}
                                </button>
                            )
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            setShowSMA20(
                                !showSMA20
                            )
                        }
                        className={`rounded-md border px-3 py-1.5 text-sm ${
                            showSMA20
                                ? "bg-muted font-semibold"
                                : ""
                        }`}
                    >
                        SMA 20
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setShowSMA50(
                                !showSMA50
                            )
                        }
                        className={`rounded-md border px-3 py-1.5 text-sm ${
                            showSMA50
                                ? "bg-muted font-semibold"
                                : ""
                        }`}
                    >
                        SMA 50
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setShowSMA200(
                                !showSMA200
                            )
                        }
                        className={`rounded-md border px-3 py-1.5 text-sm ${
                            showSMA200
                                ? "bg-muted font-semibold"
                                : ""
                        }`}
                    >
                        SMA 200
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setShowEMA20(
                                !showEMA20
                            )
                        }
                        className={`rounded-md border px-3 py-1.5 text-sm ${
                            showEMA20
                                ? "bg-muted font-semibold"
                                : ""
                        }`}
                    >
                        EMA 20
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setShowEMA50(
                                !showEMA50
                            )
                        }
                        className={`rounded-md border px-3 py-1.5 text-sm ${
                            showEMA50
                                ? "bg-muted font-semibold"
                                : ""
                        }`}
                    >
                        EMA 50
                    </button>
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
                                tickFormatter={
                                    formatAxisDate
                                }
                                tick={{
                                    fontSize: 12,
                                }}
                                minTickGap={35}
                            />

                            <YAxis
                                domain={[
                                    "auto",
                                    "auto",
                                ]}
                                tick={{
                                    fontSize: 12,
                                }}
                                tickFormatter={(
                                    value
                                ) =>
                                    `$${Number(
                                        value
                                    ).toFixed(
                                        0
                                    )}`
                                }
                            />

                            <Tooltip
                                labelFormatter={(
                                    value
                                ) =>
                                    formatDate(String
                                        (value)
                                    )
                                }
                                formatter={(
                                    value,
                                    name
                                ) => [
                                    `$${Number(
                                        value
                                    ).toFixed(
                                        2
                                    )}`,
                                    name,
                                ]}
                            />

                            <Line
                                type="monotone"
                                dataKey="price"
                                name="Price"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{
                                    r: 5,
                                }}
                            />

                            {showSMA20 && (
                                <Line
                                    type="monotone"
                                    dataKey="sma20"
                                    name="SMA 20"
                                    strokeWidth={
                                        1.5
                                    }
                                    dot={false}
                                    connectNulls
                                />
                            )}

                            {showSMA50 && (
                                <Line
                                    type="monotone"
                                    dataKey="sma50"
                                    name="SMA 50"
                                    strokeWidth={
                                        1.5
                                    }
                                    dot={false}
                                    connectNulls
                                />
                            )}

                            {showSMA200 && (
                                <Line
                                    type="monotone"
                                    dataKey="sma200"
                                    name="SMA 200"
                                    strokeWidth={
                                        1.5
                                    }
                                    dot={false}
                                    connectNulls
                                />
                            )}

                            {showEMA20 && (
                                <Line
                                    type="monotone"
                                    dataKey="ema20"
                                    name="EMA 20"
                                    strokeWidth={
                                        1.5
                                    }
                                    dot={false}
                                    connectNulls
                                />
                            )}

                            {showEMA50 && (
                                <Line
                                    type="monotone"
                                    dataKey="ema50"
                                    name="EMA 50"
                                    strokeWidth={
                                        1.5
                                    }
                                    dot={false}
                                    connectNulls
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}