-- CreateTable
CREATE TABLE "FinancialMetric" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "grossProfitMarginTTM" DOUBLE PRECISION,
    "operatingProfitMarginTTM" DOUBLE PRECISION,
    "netProfitMarginTTM" DOUBLE PRECISION,
    "returnOnEquityTTM" DOUBLE PRECISION,
    "returnOnAssetsTTM" DOUBLE PRECISION,
    "debtToEquityTTM" DOUBLE PRECISION,
    "currentRatioTTM" DOUBLE PRECISION,
    "priceToEarningsRatioTTM" DOUBLE PRECISION,
    "priceToSalesRatioTTM" DOUBLE PRECISION,
    "priceToBookRatioTTM" DOUBLE PRECISION,
    "dividendYieldTTM" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FinancialMetric_symbol_key" ON "FinancialMetric"("symbol");
