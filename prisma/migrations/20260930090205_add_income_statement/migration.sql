-- CreateTable
CREATE TABLE "IncomeStatement" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fiscalYear" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "reportedCurrency" TEXT NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "grossProfit" DOUBLE PRECISION NOT NULL,
    "operatigIncome" DOUBLE PRECISION NOT NULL,
    "ebitda" DOUBLE PRECISION NOT NULL,
    "netIncome" DOUBLE PRECISION NOT NULL,
    "epsDiluted" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncomeStatement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IncomeStatement_symbol_date_key" ON "IncomeStatement"("symbol", "date");

-- CreateIndex
CREATE UNIQUE INDEX "IncomeStatement_symbol_key" ON "IncomeStatement"("symbol");
