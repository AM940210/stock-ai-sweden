"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    Search,
    RefreshCw,
    TrendingUp,
    ShieldCheck,
    BarChart3,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ScreenerResult = {
    symbol: string;
    companyName: string;
    market: string;
    sector: string | null;
    industry: string | null;

    score: number;
    label: "Strong" | "Good" | "Neutral" | "Weak";

    fundamentalsScore: number;
    valuationScore: number;
    technicalScore: number;

    reasons: string[];

    technical: {
        close: number;
        sma20: number | null;
        sma50: number | null;
        sma200: number | null;
        rsi14: number | null;
        macd: number | null;
        macdSignal: number | null;
    } | null;
};

type ScreenerResponse = {
    count: number;
    results: ScreenerResult[];
};

function getScoreBadge(label: ScreenerResult["label"]) {
    switch (label) {
        case "Strong":
            return "bg-green-100 text-green-700 border-green-200";
        case "Good":
            return "bg-blue-100 text-blue-700 border-blue-200";
        case "Neutral":
            return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case "Weak":
            return "bg-red-100 text-red-700 border-red 200";
    }
}

function getScoreBar(score: number, max: number) {
    return Math.min(100, Math.max(0, (score / max) * 100));
}

function ScoreBar({
    label,
    score,
    max,
}: {
    label: string;
    score: number;
    max: number;
}) {
    const percentage = getScoreBar(score, max);

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    {label}
                </span>

                <span className="font-semibold">
                    {score}/{max}
                </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}

function getReasonIcon(reason: string) {
    if (
        reason.toLowerCase().includes("high") ||
        reason.toLowerCase().includes("negative") ||
        reason.toLowerCase().includes("weak")
    ) {
        return "⚠";
    }

    return "✓";
}

export default function ScreenerDashboard() {
    const [results, setResults] = useState<ScreenerResult[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<
    "All" | "Strong" | "Good" | "Neutral" | "Weak"
    >("All");
    
    const [expanded, setExpanded] = useState<string | null>(
        null
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadScreener() {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                "/api/screener?limit=100",
                {
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load screener results"
                );
            }

            const data: ScreenerResponse =
                await response.json();

            setResults(data.results);
        } catch (error) {
            console.error(error);

            setError(
                "Could not load screener results."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadScreener();
    }, []);

    const filteredResults = useMemo(() => {
        return results.filter((stock) => {
            const matchesSearch = 
                stock.symbol
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                stock.companyName
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesFilter =
                filter === "All" ||
                stock.label === filter;

            return (
                matchesSearch &&
                matchesFilter
            );
        });
    }, [results, search, filter]);

    const strongCount = results.filter(
        (stock) => stock.label === "Strong"
    ).length;

    const goodCount = results.filter(
        (stock) => stock.label === "Good"
    ).length;

    const neutralCount = results.filter(
        (stock) => stock.label === "Neutral"
    ).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Stock Screener
                    </h1>

                    <p className="mt-l text-muted-foreground">
                        Find stocks using fundamentals,
                        valuation and technical signals.
                    </p>
                </div>

                <Button
                    onClick={loadScreener}
                    disabled={loading}
                    variant="outline"
                >
                    <RefreshCw
                        className={`mr-2 h-4 w-4 ${
                            loading
                                ? "animate-spin"
                                : ""
                        }`}
                    />
                    Refresh
                </Button>
            </div>

            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-background p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Stocks screened
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                                {results.length}
                            </p>
                        </div>

                        <BarChart3 className="h-6 w-6 text-muted-foreground" />
                    </div>
                </div>

                <div className="rounded-xl border bg-background p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Strong
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                                {strongCount}
                            </p>
                        </div>

                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                </div>

                <div className="rouunded-xl border bg-background p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Good
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                                {goodCount}
                            </p>
                        </div>

                        <ShieldCheck className="h-6 w-6 text-blue-600" />
                    </div>
                </div>

                <div className="rounded-xl border bg-background p-5 shadow-sm">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Neutral
                        </p>

                        <p className="mt-1 text-2xl font-bold">
                            {neutralCount}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-3 rounded-xl border bg-background p-4 shadow-sm md:flex-row">
                <div className="relative flex-1">
                    <search className="absolute left-3 top-1/2 h-4 w-4 -transilate-y-1/2 text-muted-foreground" />

                    <Input
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        placeholder="Search by symbol or company..."
                        className="pl-9"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {[
                        "All",
                        "Strong",
                        "Good",
                        "Neutral",
                        "Weak",
                    ].map((option) => (
                        <Button
                            key={option}
                            size="sm"
                            variant={
                                filter === option
                                    ? "default"
                                    : "outline"    
                            }
                            onClick={() =>
                                setFilter(
                                    option as typeof filter
                                )
                            }
                        >
                            {option}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="rounded-xl border bg-background p-12 text-center">
                    <RefreshCw className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />

                    <p className="mt-3 text-sm text-muted-foreground">
                        Running stock screener...
                    </p>
                </div>
            )}

            {/* Results */}
            {!loading && (
                <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
                    {/* Desktop header */}
                    <div className="hidden border-b bg-muted/30 px-3 text-sm font-medium text-muted-foreground lg:grid lg:grid-cols-[50px_1.5fr_120px_150px_150px_120px_40px] lg:gap-4">
                        <div>#</div>
                        <div>Stock</div>
                        <div>Score</div>
                        <div>Fundamentals</div>
                        <div>Valuation</div>
                        <div>Technical</div>
                        <div />
                    </div>

                    {filteredResults.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            No stocks match your filters.
                        </div>
                    ) : (
                        filteredResults.map(
                            (stock, index) => {
                                const isExpanded =
                                    expanded ===
                                    stock.symbol;

                                return (
                                    <div
                                        key={stock.symbol}
                                        className="border-b last:border-b-0"
                                    >
                                        {/* Main row */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpanded(
                                                    isExpanded
                                                        ? null
                                                        : stock.symbol       
                                                )
                                            }
                                            className="w-full text-left trasition-colors hover:bg-muted/40"
                                        >
                                            <div className="grid gap-4 px-5 py-5 lg-grid-cols-[50px_1.5fr_120px_150px_150px_120px_40px] lg:items-center">
                                                {/* Rank */}
                                                <div className="text-sm font-medium text-muted-foreground">
                                                    {index + 1}
                                                </div>

                                                {/* Stock */}
                                                <div>
                                                    <div className="font-bold">
                                                        {
                                                            stock.symbol
                                                        }
                                                    </div>

                                                    <div className="text-sm text-muted-foreground">
                                                        {
                                                            stock.companyName
                                                        }
                                                    </div>

                                                    <div className="mt-1 text-sm text-muted-foreground">
                                                        {stock.sector ??
                                                            "Sector unavailable"
                                                        }
                                                    </div>
                                                </div>

                                                {/* Score */}
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl font-bold">
                                                            {
                                                                stock.score
                                                            }
                                                        </span>

                                                        <Badge
                                                            variant="outline"
                                                            className={getScoreBadge(
                                                                stock.label
                                                            )}
                                                        >
                                                            {
                                                                stock.label
                                                            }
                                                        </Badge>
                                                    </div>

                                                    <div className="mt-2 h-1.5 rounded-full bg-muted">
                                                        <div
                                                            className="h-full rounded-full bg-primary"
                                                            style={{
                                                                width: `${stock.score}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Fundamentals */}
                                                <ScoreBar
                                                    label="Fundamentals"
                                                    score={
                                                        stock.fundamentalsScore
                                                    }
                                                    max={50}
                                                />
                                                
                                                {/* Valuation */}
                                                <ScoreBar 
                                                    label="Valuation"
                                                    score={
                                                        stock.valuationScore
                                                    }
                                                    max={20}
                                                />

                                                {/* Technical */}
                                                <ScoreBar
                                                    label="Technical"
                                                    score={
                                                        stock.technicalScore
                                                    }
                                                    max={30}
                                                />
                                                
                                                {/* Expand */}
                                                <div className="flex justify-end">
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-5 w-5" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5" />
                                                    )}
                                                </div>
                                            </div>
                                        </button>

                                        {/* Details */}
                                        {isExpanded && (
                                            <div className="border-t bg-muted/20 px-5 py-6">
                                                <div className="grid gap-6 lg:grid-cols-2">
                                                    {/* Score breakdown */}
                                                    <div>
                                                        <h3 className="mb-4 font-semibold">
                                                            Score breakdown
                                                        </h3>

                                                        <div className="space-y-4">
                                                            <ScoreBar
                                                                label="Fundamentals"
                                                                score={
                                                                    stock.fundamentalsScore
                                                                }
                                                                max={
                                                                    50
                                                                }
                                                            />

                                                            <ScoreBar
                                                                label="Valuation"
                                                                score={
                                                                    stock.valuationScore
                                                                }
                                                                max={
                                                                    20
                                                                }
                                                            />

                                                            <ScoreBar
                                                                label="Technical"
                                                                score={
                                                                    stock.technicalScore
                                                                }
                                                                max={30}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Technical data */}
                                                    <div>
                                                        <h3 className="mb-4 font-semibold">
                                                            Technical signals
                                                        </h3>

                                                        {stock.technical ? (
                                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                                                <Metric
                                                                    label="Price"
                                                                    value={stock.technical.close}
                                                                />

                                                                <Metric
                                                                    label="SMA20"
                                                                    value={stock.technical.sma20}
                                                                />

                                                                <Metric
                                                                    label="SMA50"
                                                                    value={stock.technical.sma50}
                                                                />

                                                                <Metric 
                                                                    label="SMA200"
                                                                    value={stock.technical.sma200}
                                                                />

                                                                <Metric
                                                                    label="RSI14"
                                                                    value={stock.technical.rsi14}
                                                                />

                                                                <Metric
                                                                    label="MACD"
                                                                    value={stock.technical.macd}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground">
                                                                No technical data available.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Reasons */}
                                                <div className="mt-6">
                                                    <h3 className="mb-3 font-semibold">
                                                        Why this score?
                                                    </h3>

                                                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                                        {stock.reasons.map(
                                                            (
                                                                reason,
                                                                reasonIndex
                                                            ) => (
                                                                <div
                                                                    key={`${stock.symbol}-${reasonIndex}`}
                                                                    className="rounded-lg border bg-background px-3 py-2 text-sm"
                                                                >
                                                                    <span className="mr-2">
                                                                        {getReasonIcon(
                                                                            reason
                                                                        )}
                                                                    </span>

                                                                    {
                                                                        reason
                                                                    }
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                        )
                    )}
                </div>
            )}
        </div>
    );
}

function Metric({
    label,
    value,
}: {
    label: string;
    value: number | null;
}) {
    return (
        <div className="rounded-lg border bg-background p-3">
            <div className="text-xs text-muted-foreground">
                {label}
            </div>

            <div className="mt-1 font-semibold">
                {value != null
                    ? value.toFixed(2)
                    : "-"
                }
            </div>
        </div>
    );
}