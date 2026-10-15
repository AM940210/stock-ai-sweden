-- CreateTable
CREATE TABLE "StockUniverse" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockUniverse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockUniverse_symbol_key" ON "StockUniverse"("symbol");

-- CreateIndex
CREATE INDEX "StockUniverse_market_idx" ON "StockUniverse"("market");

-- CreateIndex
CREATE INDEX "StockUniverse_active_idx" ON "StockUniverse"("active");
