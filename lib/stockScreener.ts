import type { FinancialMetrics } from "@/lib/types";

export type ScreenerResult = {
    score: number;
    label: "Strong" | "Good" | "Neutral" | "Weak";
    fundamentalsScore: number;
    valuationScore: number;
    technicalScore: number;
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
    let fundamentalsScore = 0;
    let valuationScore = 0;
    let technicalScore = 0;

    const reasons: string[] = [];

    // ============================================
    // FUNDAMENTALS — 50 POINTS
    // ============================================

    // Net profit margin — 10 pts
    if (metrics?.netProfitMarginTTM != null) {
        const margin = metrics.netProfitMarginTTM;

        if (margin >= 0.20) {
            fundamentalsScore += 10;
            reasons.push("Excellent net profit margin");
        } else if (margin >= 0.15) {
            fundamentalsScore += 8;
            reasons.push("Strong net profit margin");
        } else if (margin >= 0.08) {
            fundamentalsScore += 5;
            reasons.push("Healthy net profit margin");
        } else if (margin < 0) {
            reasons.push("Negative net profit margin");
        }
    }

    // Operating profit margin — 8 pts
    if (metrics?.operatingProfitMarginTTM != null) {
        const margin = metrics.operatingProfitMarginTTM;

        if (margin >= 0.25) {
            fundamentalsScore += 8;
            reasons.push("Excellent operating margin");
        } else if (margin >= 0.15) {
            fundamentalsScore += 6;
            reasons.push("Strong operating margin");
        } else if (margin >= 0.08) {
            fundamentalsScore += 4;
            reasons.push("Healthy operating margin");
        }
    }

    // Gross profit margin — 5 pts
    if (metrics?.grossProfitMarginTTM != null) {
        const margin = metrics.grossProfitMarginTTM;

        if (margin >= 0.50) {
            fundamentalsScore += 5;
            reasons.push("Strong gross margin");
        } else if (margin >= 0.30) {
            fundamentalsScore += 3;
            reasons.push("Healthy gross margin");
        }
    }

    // ROE — 10 pts
    if (metrics?.returnOnEquityTTM != null) {
        const roe = metrics.returnOnEquityTTM;

        if (roe >= 0.20) {
            fundamentalsScore += 10;
            reasons.push("Excellent ROE");
        } else if (roe >= 0.15) {
            fundamentalsScore += 8;
            reasons.push("Strong ROE");
        } else if (roe >= 0.10) {
            fundamentalsScore += 5;
            reasons.push("Healthy ROE");
        } else if (roe < 0) {
            reasons.push("Negative ROE");
        }
    }

    // ROA — 5 pts
    if (metrics?.returnOnAssetsTTM != null) {
        const roa = metrics.returnOnAssetsTTM;

        if (roa >= 0.10) {
            fundamentalsScore += 5;
            reasons.push("Strong ROA");
        } else if (roa >= 0.05) {
            fundamentalsScore += 3;
            reasons.push("Healthy ROA");
        }
    }

    // Debt-to-equity — 6 pts
    if (metrics?.debtToEquityTTM != null) {
        const debt = metrics.debtToEquityTTM;

        if (debt < 0.5) {
            fundamentalsScore += 6;
            reasons.push("Low debt");
        } else if (debt < 1) {
            fundamentalsScore += 5;
            reasons.push("Moderate debt");
        } else if (debt < 2) {
            fundamentalsScore += 3;
            reasons.push("Acceptable debt level");
        } else {
            reasons.push("High debt-to-equity");
        }
    }

    // Current ratio — 6 pts
    if (metrics?.currentRatioTTM != null) {
        const ratio = metrics.currentRatioTTM;

        if (ratio >= 2) {
            fundamentalsScore += 6;
            reasons.push("Very strong liquidity");
        } else if (ratio >= 1.5) {
            fundamentalsScore += 5;
            reasons.push("Strong liquidity");
        } else if (ratio >= 1) {
            fundamentalsScore += 3;
            reasons.push("Adequate liquidity");
        } else {
            reasons.push("Weak liquidity");
        }
    }

    // ============================================
    // VALUATION — 20 POINTS
    // ============================================

    // P/E — 8 pts
    if (metrics?.priceToEarningsRatioTTM != null) {
        const pe = metrics.priceToEarningsRatioTTM;

        if (pe > 0 && pe < 15) {
            valuationScore += 8;
            reasons.push("Attractive P/E");
        } else if (pe >= 15 && pe < 20) {
            valuationScore += 6;
            reasons.push("Reasonable P/E");
        } else if (pe >= 20 && pe < 30) {
            valuationScore += 3;
            reasons.push("Moderate P/E");
        } else if (pe >= 30) {
            reasons.push("High P/E valuation");
        } else if (pe <= 0) {
            reasons.push("Company has negative earnings");
        }
    }

    // P/B — 6 pts
    if (metrics?.priceToBookRatioTTM != null) {
        const pb = metrics.priceToBookRatioTTM;

        if (pb > 0 && pb < 1.5) {
            valuationScore += 6;
            reasons.push("Attractive P/B");
        } else if (pb >= 1.5 && pb < 3) {
            valuationScore += 4;
            reasons.push("Reasonable P/B");
        } else if (pb >= 3 && pb < 5) {
            valuationScore += 2;
            reasons.push("Moderate P/B");
        } else if (pb >= 5) {
            reasons.push("High P/B valuation");
        }
    }

    // P/S — 6 pts
    if (metrics?.priceToSalesRatioTTM != null) {
        const ps = metrics.priceToSalesRatioTTM;

        if (ps > 0 && ps < 2) {
            valuationScore += 6;
            reasons.push("Attractive P/S");
        } else if (ps >= 2 && ps < 5) {
            valuationScore += 4;
            reasons.push("Reasonable P/S");
        } else if (ps >= 5 && ps < 10) {
            valuationScore += 2;
            reasons.push("Moderate P/S");
        } else if (ps >= 10) {
            reasons.push("High P/S valuation");
        }
    }

    // ============================================
    // TECHNICAL — 30 POINTS
    // ============================================

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

        // SMA20 — 4 pts
        if (sma20 != null) {
            if (close > sma20) {
                technicalScore += 4;
                reasons.push("Price above SMA20");
            } else {
                reasons.push("Price below SMA20");
            }
        }

        // SMA50 — 6 pts
        if (sma50 != null) {
            if (close > sma50) {
                technicalScore += 6;
                reasons.push("Price above SMA50");
            } else {
                reasons.push("Price below SMA50");
            }
        }

        // SMA200 — 8 pts
        if (sma200 != null) {
            if (close > sma200) {
                technicalScore += 8;
                reasons.push("Price above SMA200");
            } else {
                reasons.push("Price below SMA200");
            }
        }

        // RSI — 6 pts
        if (rsi14 != null) {
            if (rsi14 >= 45 && rsi14 <= 65) {
                technicalScore += 6;
                reasons.push("Healthy RSI");
            } else if (rsi14 >= 40 && rsi14 < 45) {
                technicalScore += 4;
                reasons.push("Slightly weak RSI");
            } else if (rsi14 > 65 && rsi14 <= 70) {
                technicalScore += 3;
                reasons.push("Strong but elevated RSI");
            } else if (rsi14 > 70) {
                reasons.push("RSI indicates overbought conditions");
            } else {
                reasons.push("Weak RSI");
            }
        }

        // MACD — 6 pts
        if (macd != null && macdSignal != null) {
            if (macd > macdSignal) {
                technicalScore += 6;
                reasons.push("Positive MACD momentum");
            } else {
                reasons.push("Negative MACD momentum");
            }
        }
    }

    const score =
        fundamentalsScore +
        valuationScore +
        technicalScore;

    let label: ScreenerResult["label"];

    if (score >= 80) {
        label = "Strong";
    } else if (score >= 65) {
        label = "Good";
    } else if (score >= 50) {
        label = "Neutral";
    } else {
        label = "Weak";
    }

    return {
        score,
        label,
        fundamentalsScore,
        valuationScore,
        technicalScore,
        reasons,
    };
}