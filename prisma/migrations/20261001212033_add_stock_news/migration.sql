-- CreateTable
CREATE TABLE "StockNews" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "snippet" TEXT,
    "url" TEXT NOT NULL,
    "imageUrl" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockNews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockNews_uuid_key" ON "StockNews"("uuid");

-- CreateIndex
CREATE INDEX "StockNews_symbol_idx" ON "StockNews"("symbol");

-- CreateIndex
CREATE INDEX "StockNews_symbol_publishedAt_idx" ON "StockNews"("symbol", "publishedAt");
