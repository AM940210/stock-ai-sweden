export type PricePoint = {
    date: string;
    close: number;
};

export type TechnicalPricePoint = PricePoint & {
    sma20: number | null;
    sma50: number | null;
    sma200: number | null;
    ema20: number | null;
    ema50: number | null;
    rsi14: number | null;
};

export function calculateSMA(
    prices: number[],
    period: number
): (number | null)[] {
    return prices.map((_, index) => {
        if (index < period - 1) {
            return null;
        }

        const slice = prices.slice(
            index - period + 1,
            index + 1
        );

        const sum = slice.reduce(
            (total, price) => total + price,
            0
        );

        return sum / period;
    });
}

export function calculateEMA(
    prices: number[],
    period: number
): (number | null)[] {
    const result: (number | null)[] = [];

    const multiplier = 2 / (period + 1);

    prices.forEach((price, index) => {
        if (index < period - 1) {
            result.push(null);
            return;
        }

        if (index === period - 1) {
            const initialPrices = prices.slice(
                0,
                period
            );

            const initialSMA = 
                initialPrices.reduce(
                    (sum, value) => sum + value,
                    0
                ) / period;

            result.push(initialSMA);
            return;
        }

        const previousEMA =
            result[index - 1];

        if (previousEMA === null) {
            result.push(null);
            return;
        }

        const ema = 
            (price - previousEMA) * multiplier +
            previousEMA;

        result.push(ema);
    });

    return result;
}

export function calculateRSI(
    prices: number[],
    period: number = 14
): (number | null)[] {
    const result: (number | null)[] =
        new Array(prices.length).fill(null);

    if (prices.length <= period) {
        return result;
    }

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
        const change =
            prices[i] - prices[i - 1];

        if (change > 0) {
            gains += change;
        } else {
            losses += Math.abs(change);
        }
    }

    let averageGain = gains / period;
    let averageLoss = losses / period;

    result[period] = calculateRSIValue(
        averageGain,
        averageLoss
    );

    for (
        let i = period + 1;
        i < prices.length;
        i++
    ) {
        const change =
            prices[i] - prices[i - 1];

        const gain =
            change > 0 ? change : 0;
        
        const loss =
            change < 0 ? Math.abs(change) : 0;

        averageGain =
            (averageGain * (period - 1) +
                gain) /
            period;

        averageLoss =
            (averageLoss * (period - 1) +
                loss) /
            period;

        result[i] = calculateRSIValue(
            averageGain,
            averageLoss
        );
    }

    return result;
}

function calculateRSIValue(
    averageGain: number,
    averageLoss: number
): number {
    if (averageLoss === 0) {
        return 100;
    }

    const relativeStrength =
        averageGain / averageLoss;

    return (
        100 -
        100 / (1 + relativeStrength)
    );
}

export function calculateTechnicalIndicators(
    data: PricePoint[]
): TechnicalPricePoint[] {
    const sortedData = [...data].sort(
        (a, b) =>
            new Date(a.date).getTime() -
            new Date(b.date).getTime()
    );

    const prices = sortedData.map(
        (item) => item.close
    );

    const sma20 = calculateSMA(prices, 20);
    const sma50 = calculateSMA(prices, 50);
    const sma200 = calculateSMA(prices, 200);

    const ema20 = calculateEMA(prices, 20);
    const ema50 = calculateEMA(prices, 50);

    const rsi14 = calculateRSI(prices, 14);

    return sortedData.map((item, index) => ({
        ...item,
        sma20: sma20[index],
        sma50: sma50[index],
        sma200: sma200[index],
        ema20: ema20[index],
        ema50: ema50[index],
        rsi14: rsi14[index],
    }));
}