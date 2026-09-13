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