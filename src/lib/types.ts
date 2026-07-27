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