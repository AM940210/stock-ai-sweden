"use client";

import {
    LineChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

type MACDData = {
    date: string;
    macd: number | null;
    macdSignal: number | null;
    macdHistogram: number | null;
};

type Props = {
    data: MACDData[];
};

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export default function MACDChart({ data }: Props) {
    const chartData = [...data]
    .reverse()
    .map((item) => ({
        date: item.date,
        macd: item.macd,
        signal: item.macdSignal,
        histogram: item.macdHistogram,
    }));

    return (
        <section className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    MACD
                </h2>

                <p className="text-sm text-muted-foreground">
                    Moving Average Convergence Divergence .
                    12 / 26 / 9
                </p>
            </div>

            <div className="h-[300px] w-full">
                {chartData.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No MACD data available.
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
                                    formatDate(String(value))
                                }
                                tick={{ fontSize: 12 }}
                                minTickGap={35}
                            />

                            <YAxis
                                tick={{ fontSize: 12 }}
                                minTickGap={35}
                            />

                            <Tooltip
                                labelFormatter={(value) =>
                                    formatDate(String(value))
                                }
                                formatter={(value, name) => [
                                    Number(value).toFixed(2),
                                    name,
                                ]}
                            />

                            <ReferenceLine y={0} />

                            <Bar
                                dataKey="histogram"
                                name="histogram"
                                fill="currentColor"
                                opacity={0.35}
                            />

                            <Line
                                type="monotone"
                                dataKey="macd"
                                name="MACD"
                                strokeWidth={2}
                                dot={false}
                                connectNulls
                            />

                            <Line 
                                type="monotone"
                                dataKey="signal"
                                name="Signal"
                                strokeWidth={2}
                                dot={false}
                                connectNulls
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </section>
    );
}