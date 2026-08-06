import { z } from "zod";

export const stockSchema = z.object({
    symbol: z.string().trim().min(1),
    companyName: z.string().trim().min(1),
    market: z.string().trim().min(1),
    sector: z.string().trim().optional(),
    industry: z.string().trim().optional(),
    currentPrice: z.coerce.number().nonnegative().optional(),
    currency: z.string().trim().optional(),
});

export type StockInput = z.input<typeof stockSchema>;

export const updateStockSchema = stockSchema.partial();