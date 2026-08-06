import AddStockDialog from "./AddStockDialog";

export default function DashboardHeader() {
    return (
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">
                    InvestAI
                </h1>

                <p className="mt-2 text-muted-foreground">
                    AI-powered investment research with live market data, charts, financial analysis and news.
                </p>
            </div>

            <AddStockDialog />
        </div>
    );
}