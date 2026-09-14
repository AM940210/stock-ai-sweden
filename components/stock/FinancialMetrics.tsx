import type { FinancialMetrics } from "@/lib/types";

type Props = {
    data: FinancialMetrics;
};

function formatRatio(value: number | null) {
    if (value === null || value === undefined) {
        return "-";
    }

    return value.toFixed(2);
}

function formatPercent(value: number | null) {
    if (value === null || value === undefined) {
        return "-";
    }

    return `${(value * 100).toFixed(2)}%`;
}

type MetricCardProps = {
    label: string;
    value: string;
};

function MetricCard({ label, value }: MetricCardProps) {
    return (
        <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">
                {label}
            </p>

            <p className="mt-1 text-xl font-semibold">
                {value}
            </p>
        </div>
    );
}

export default function FinancialMetrics({ data }: Props) {
    return (
        <section className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    Financial Metrics
                </h2>

                <p className="text-sm text-muted-foreground">
                    Key valuation, profitability and financial health metrics
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard 
                    label="P/S Ratio"
                    value={formatRatio(data.priceToEarningsRatioTTM)}
                />

                <MetricCard 
                    label="P/S Ratio"
                    value={formatRatio(data.priceToSalesRatioTTM)}
                />

                <MetricCard 
                    label="P/S Ratio"
                    value={formatRatio(data.priceToBookRatioTTM)}
                />

                <MetricCard 
                    label="P/S Ratio"
                    value={formatRatio(data.dividendYieldTTM)}
                />

                <MetricCard 
                    label="P/S Ratio"
                    value={formatRatio(data.grossProfitMarginTTM)}
                />

                <MetricCard 
                    label="P/S Ratio"
                    value={formatRatio(data.operatingProfitMarginTTM)}
                />

                <MetricCard 
                    label="P/S Ratio"
                    value={formatRatio(data.netProfitMarginTTM)}
                />

                <MetricCard 
                    label="P/S Ratio"
                    value={formatRatio(data.returnOnEquityTTM)}
                />

                <MetricCard 
                    label="P/S Ratio"
                    value={formatRatio(data.returnOnAssetsTTM)}
                />

                <MetricCard 
                    label="P/S Ratio"
                    value={formatRatio(data.debtToEquityTTM)}
                />

                <MetricCard 
                    label="P/S Ratio"
                    value={formatRatio(data.currentRatioTTM)}
                />
            </div>
        </section>
    );
}