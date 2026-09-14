export type Stock = {
  id: string;
  symbol: string;
  companyName: string;
  market: string;
  sector: string | null;
  industry: string | null;
  currentPrice: number | null;
  currency: string | null;
};

export type IncomeStatementData = {
    date: string;
    fiscalYear: string;
    period: string;
    reportedCurrency: string;
    revenue: number;
    grossProfit: number;
    operatingIncome: number;
    ebitda: number;
    netIncome: number;
    epsDiluted: number;
};

export type FinancialMetrics = {
  symbol: string;

  grossProfitMarginTTM: number | null;
  operatingProfitMarginTTM: number | null;
  netProfitMarginTTM: number | null;

  returnOnEquityTTM: number | null;
  returnOnAssetsTTM: number | null;

  debtToEquityTTM: number | null;
  currentRatioTTM: number | null;

  priceToEarningsRatioTTM: number | null;
  priceToSalesRatioTTM: number | null;
  priceToBookRatioTTM: number | null;

  dividendYieldTTM: number | null;
};