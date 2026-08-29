type Quote = {
    symbol: string;
    price: number;
    change: number;
    changePercentage: number;
};

type Props = {
    quote: Quote;
};

export default function QuoteCard({ quote }: Props) {
    const isPositive = quote.change >= 0;

    return (
        <div className="rounded-xl border bg-background p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">
                Current Price
            </p>

            <div className="mt-2 flex items-end gap-4">
                <p className="text-4xl font-bold">
                    ${quote.price.toFixed(2)}
                </p>

                <p
                    className={
                        isPositive
                            ? "text-lg font-semibold text-green-600"
                            : "text-lg font-semibold text-red-600"
                    }
                >
                    {isPositive ? "+" : ""}
                    {quote.change.toFixed(2)}
                    {" ("}
                    {isPositive ? "+" : ""}
                    {quote.changePercentage.toFixed(2)}%
                    {")"}
                </p>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
                {quote.symbol}
            </p>
        </div>
    );
}