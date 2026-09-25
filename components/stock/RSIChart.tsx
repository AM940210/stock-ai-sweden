"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { string } from "zod";

type RSIData = {
    date: string;
    rsi14: number | null;
};

type Props = {
    data: RSIData[];
};

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export default function RSIData({ data }: Props) {
    const chartData = [...data]
    .reverse()
    .map((item) => ({
        date: item.date,
        rsi: item.rsi14,
    }));

    return (
        <section className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    RSI
                </h2>

                <p className="text-sm text-muted-foreground">
                    Relative Strength Index . 14 periods
                </p>
            </div>

            <div className="h-[250px] w-full">
                {chartData.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No RSI data available
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
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) =>
                                    formatDate(String(value))
                                }
                                tick={{ fontSize: 12 }}
                                minTickGap={35}
                            />

                            <YAxis
                                domain={[0, 100]}
                                ticks={[
                                    0,
                                    30,
                                    50,
                                    70,
                                    100,
                                ]}
                                tick={{ fontSize: 12 }}
                            />

                            <Tooltip
                                labelFormatter={(value) =>
                                    formatDate(String(value))
                                }
                                formatter={(value) => [
                                    Number(value).toFixed(2),
                                    "RSI",
                                ]}
                            />

                            <ReferenceLine
                                y={70}
                                strokeDasharray="4 4"
                            />

                            <ReferenceLine
                                y={50}
                                strokeDasharray="4 4"
                            />

                            <ReferenceLine
                                y={30}
                                strokeDasharray="4 4"
                            />

                            <Line
                                type="monotone"
                                dataKey="rsi"
                                name="RSI 14"
                                strokeWidth={2}
                                dot={false}
                                connectNulls
                            />                        
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>70 - Overbought zone</span>
                <span>50 - Midpoint</span>
                <span>30 - Oversold</span>
            </div>
        </section>
    );
}