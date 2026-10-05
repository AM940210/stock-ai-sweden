import type { FinancialMetrics } from "@/lib/types";

export type ScreenerResult = {
    score: number;
    label: "Strong" | "Good" | "Neutral" | "Weak";
    reasons: string[];
};

type TechnicalData = {
    close: number;
    sma20: number | null;
    sma50: number | null;
    sma200: number | null;
    rsi14: number | null;
    macd: number | null;
    macdSignal: number | null;
};

export function calculateStockScore(
    metrics: FinancialMetrics | null,
    technical: TechnicalData | null
): ScreenerResult {
    let score = 0;
    const reasons: string[] = [];

    // -------------------------
    // PROFITABILITY
    // -------------------------

    if (metrics?.returnOnEquityTTM != null) {
        if (metrics.returnOnEquityTTM >= 0.15) {
            score += 15;
            reasons.push("Strong ROE");
        } else if (metrics.returnOnEquityTTM >= 0.10) {
            score += 10;
            reasons.push("Healthy ROE");
        }
    }

    if (metrics?.netProfitMarginTTM != null) {
        if (metrics.netProfitMarginTTM >= 0.15) {
            score += 15;
            reasons.push("Strong net profit margin");
        } else if (metrics.netProfitMarginTTM >= 0.08) {
            score += 10;
            reasons.push("Healthy net profit margin");
        }
    }

    // ---------------------------
    // FINANCIAL HEALTH
    // ---------------------------

    if (metrics?.debtToEquityTTM != null) {
        if (metrics.debtToEquityTTM < 1) {
            score += 10;
            reasons.push("Moderate debt");
        } else if (metrics.debtToEquityTTM < 2) {
            score += 5;
            reasons.push("Acceptable debt level");
        }
    }

    if (metrics?.currentRatioTTM != null) {
        if (metrics.currentRatioTTM >= 1.5) {
            score += 10;
            reasons.push("Strong liquidity");
        } else if (metrics.currentRatioTTM >= 1) {
            score += 5;
            reasons.push("Adequate liquidity");
        }
    }

    // -----------------------------
    // VALUATION
    // -----------------------------

    if (metrics?.priceToEarningsRatioTTM != null) {
        const pe = metrics.priceToEarningsRatioTTM;

        if (pe > 0 && pe < 20) {
            score += 10;
            reasons.push("Reasonable P/E");
        } else if (pe >= 20 && pe < 30) {
            score += 5;
            reasons.push("Moderate P/E");
        }
    }

    if (metrics?.priceToBookRatioTTM != null) {
        const pb = metrics.priceToBookRatioTTM;

        if (pb > 0 && pb < 3) {
            score += 5;
            reasons.push("Reasonable P/B");
        }
    }

    // ----------------------------
    // TECHNICAL TREND
    // ----------------------------

    if (technical) {
        const {
            close,
            sma20,
            sma50,
            sma200,
            rsi14,
            macd,
            macdSignal,
        } = technical;

        if (sma20 != null && close > sma20) {
            score += 5;
            reasons.push("Price above SMA20")
        }

        if (sma50 != null && close > sma50) {
            score += 5;
            reasons.push("Price above SMA50");
        }

        if (sma200 != null && close > sma200) {
            score += 10;
            reasons.push("Price above SMA200"); 
        }

        if (rsi14 != null) {
            if (rsi14 >= 40 && rsi14 <= 65) {
                score += 5;
                reasons.push("Healthy RSI");
            } else if (rsi14 > 70) {
                score -= 5;
                reasons.push("RSI indicates overbought conditions");
            }
        }

        if (
            macd != null &&
            macdSignal != null &&
            macd > macdSignal
        ) {
            score += 10;
            reasons.push("Positive MACD momentum");
        }
    }

    // -------------------------
    // FINAL LABEL
    // -------------------------

    let label: ScreenerResult["label"];

    if (score >= 75) {
        label = "Strong";
    } else if (score >= 55) {
        label = "Good";
    } else if (score >= 35) {
        label = "Neutral";
    } else {
        label = "Weak";
    }

    return {
        score,
        label,
        reasons,
    };
}