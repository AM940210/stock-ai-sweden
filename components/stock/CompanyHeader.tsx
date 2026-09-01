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
    const isPositive = company.change >= 0;

    return (
        <div className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex md:items-center">

                {/* Company Logo */}
                <div className="flex shrink-0 justify-center">
                    <img 
                        src={company.image} 
                        alt={company.companyName}
                        className="h-24 w-24 rounded-xl object-contain"
                    />
                </div>
                
                {/* Company Information */}
                <div className="flex-1">

                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold">
                            {company.companyName}
                        </h1>

                        <p className="text-xl text-muted-foreground">
                            {company.symbol}
                        </p>
                    </div>
                    
                    {/* Price */}
                    <div className="mt-5 flex flex-wrap items-end gap-4">

                        <span className="text-4xl font-bold">
                            ${company.price.toFixed(2)}
                        </span>

                        <span
                            className={
                                isPositive
                                    ? "text-xl font-semibold text-green-600"
                                    : "text-xl font-semibold text-red-600"
                            }    
                        >
                            {isPositive ? "+" : ""}
                            {company.change.toFixed(2)} 
                            {" ("}
                            {isPositive ? "+" : ""}
                            {company.changePercentage.toFixed(2)}%
                            {")"}
                        </span>

                    </div>

                    {/* Details */}
                    <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">

                        <div>
                            <p className="text-muted-foreground">
                                Exchange
                            </p>
                            <p className="font-medium">
                                {company.exchange}
                            </p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">
                                Industry
                            </p>
                            <p className="font-medium">
                                {company.industry}
                            </p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">
                                Sector
                            </p>
                            <p className="font-medium">
                                {company.sector}
                            </p>
                        </div>

                        <div>
                            <p className="text-muted-foreground">
                                CEO
                            </p>
                            <p className="font-medium">
                                {company.ceo}
                            </p>
                        </div>
                    </div>

                    {/* Website */}
                    <a 
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-block text-blue-600 hover:underline"
                    >
                        {company.website}
                    </a>
                </div>
            </div>
        </div>
    );
}