type Props = {
    params: Promise<{
        symbol: string;
    }>;
};

export default async function StockDetailsPage({
    params,
}: Props) {
    const { symbol } = await params;

    return (
        <main className="max-w-7xl mx-auto p-8">
            <h1 className="text-4xl font-bold">
                {decodeURIComponent(symbol)}
            </h1>

            <p className="mt-4 text-muted-foreground">
                Loading company information...
            </p>
        </main>
    );
}