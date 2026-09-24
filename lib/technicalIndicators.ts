export type PricePoint = {
    date: string;
    close: number;
};

export type TecknicalPricePoint = PricePoint & {
    sma20: number | null;
    sma50: number | null;
    sma200: number | null;
    ema20: number | null;
    ema50: number | null;
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

    return sortedData.map((item, index) => ({
        ...item,
        sma20: sma20[index],
        sma50: sma50[index],
        sma200: sma200[index],
        ema20: ema20[index],
        ema50: ema50[index],
    }));
}