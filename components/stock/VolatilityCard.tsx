type Props = {
    volatility: number | null;
};

export default function volatilityCard({
    volatility,
}: Props) {
    if (volatility === null) {
        return (
            <section className="rounded-xl border bg-background p-6 shadow-sm">
                <h2 className="text-xl font-semibold">
                    Volatility
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Not enough historical data.
                </p>
            </section>
        );
    }

    return (
        <section className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-4">
                <h2 className="text-xl font-semibold">
                    Historical Volatility
                </h2>

                <p className="text-sm text-muted-foreground">
                    20-day annualized volatility
                </p>
            </div>

            <div className="text-3xl font-bold">
                {(volatility * 100).toFixed(2)}%
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
                Higher volatility means larger historical price fluctuations.
            </p>
        </section>
    );
}