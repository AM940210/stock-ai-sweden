-- CreateTable
CREATE TABLE "HistoricalPrice" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "change" DOUBLE PRECISION,
    "changePercent" DOUBLE PRECISION,
    "vwap" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoricalPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HistoricalPrice_symbol_idx" ON "HistoricalPrice"("symbol");

-- CreateIndex
CREATE INDEX "HistoricalPrice_symbol_date_idx" ON "HistoricalPrice"("symbol", "date");

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalPrice_symbol_date_key" ON "HistoricalPrice"("symbol", "date");
