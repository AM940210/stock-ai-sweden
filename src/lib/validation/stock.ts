import { z } from "zod";

export const stockSchema = z.object({
    symbol: z.string().trim().min(1, "Symbol is required"),
    companyName: z.string().trim().min(1, "Company name is required"),
    market: z.string({
        error: "Market is required",
    }).trim().min(1, "Market is required"),
    sector: z.string().trim().optional(),
    industry: z.string().trim().optional(),
    currentPrice: z.number().nonnegative().optional(),
    currency: z.string().trim().optional(),
});

export type StockInput = z.infer<typeof stockSchema>;