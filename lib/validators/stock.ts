import { z } from "zod";

export const stockSchema = z.object({
    symbol: z.string().min(1, "Symbol is required"),
    companyName: z.string().min(1, "Company name is required"),
    market: z.string().min(1, "Market is required"),
    sector: z.string().min(1, "Sector is required"),
    currentPrice: z.coerce.number().positive("Price must be greater than 0"),
    currency: z.string().min(1),
});

export type StockFormValues = z.input<typeof stockSchema>;