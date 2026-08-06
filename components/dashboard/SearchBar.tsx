"use client";

import { useEffect, useState } from "react";
import type {
    FinnhubSearchResponse,
    FinnhubSearchResult,
} from "@/lib/types/finnhub";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function SearchBar({
    value,
    onChange,
}: SearchBarProps) {
    const [results, setResults] = useState<FinnhubSearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (value.trim().length < 2) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `/api/search?q=${encodeURIComponent(value)}`
                );

                if (!response.ok) {
                    throw new Error("Search failed");
                }

                const data: FinnhubSearchResponse = await response.json();

                setResults(data.result);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search stocks..."
                className="h-11 pl-10"
            />

            {loading && (
                <div className="mt-2 rounded-md border bg-background p-3 text-sm text-muted-foreground">
                    Searching...
                </div>
            )}

            {results.length > 0 && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border bg-background shadow-lg">
                    {results.map((stock) => (
                        <button
                            key={stock.symbol}
                            type="button"
                            className="block w-full border-b p-4 text-left hover:bg-muted"
                        >
                            <div className="font-semibold">
                                {stock.displaySymbol}
                            </div>

                            <div className="text-sm text-muted-foreground">
                                {stock.description}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );  
}