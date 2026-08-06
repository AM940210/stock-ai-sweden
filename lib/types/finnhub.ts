export type FinnhubSearchResult = {
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
};

export type FinnhubSearchResponse = {
    count: number;
    result: FinnhubSearchResult[];
};