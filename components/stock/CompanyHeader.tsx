import { symbol } from "zod";

type CompanyProfile = {
    symbol: string;
    companyName: string;
    price: number;
    change: number;
    changePercentage: number;
    exchange: string;
    industry: string;
    sector: string;
    website: string;
    image: string;
    ceo: string;
    marketCap: number;
    country: string;
};

type Props = {
    company: CompanyProfile;
};

export default function CompanyProfile({ company }: Props) {
    return (
        <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="flex items-center gap-6">
                <img 
                    src={company.image} 
                    alt={company.companyName}
                    className="h-20 w-20 rounded-xl"
                />

                <div className="flex-1">
                    <h1 className="text-3xl font-bold">
                        {company.companyName}
                    </h1>

                    <p className="text-muted-foreground">
                        {company.symbol}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm">
                        <span>${company.price}</span>

                        <span
                            className={
                                company.change >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                            }    
                        >
                            {company.change.toFixed(2)} (
                                {company.changePercentage.toFixed(2)}%)
                        </span>

                        <span>{company.industry}</span>

                        <span>{company.exchange}</span>

                        <span>{company.ceo}</span>
                    </div>

                    <a 
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-block text-blue-600 hover:underline"
                    >
                        {company.website}
                    </a>
                </div>
            </div>
        </div>
    );
}