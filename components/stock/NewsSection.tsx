import type { StockNews } from "@/lib/types";
import { ExternalLink, Newspaper } from "lucide-react";

type Props = {
    data: StockNews[];
};

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

export default function NewsSection({ data }: Props) {
    return (
        <section className="rounded-xl border bg-background p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                    <Newspaper className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="text-xl font-semibold">
                        Latest News
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Latest news related to this company
                    </p>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted foreground">
                    No news available.
                </div>
            ) : (
                <div className="space-y-4">
                    {data.map((article, index) => (
                        <article
                            key={`${article.url}-${index}`}
                            className="group rounded-lg border p-4 transition hover:bg-muted/50"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row">
                                {article.image_url && (
                                    <div className="h-32 w-full shrink-0 overflow-hidden rounded-lg sm:w-48">
                                        <img 
                                            src={article.image_url}
                                            alt=""
                                            className="h-full w-full object-cover transition group-hover:scale-105"
                                        />
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                        <span className="font-medium">
                                            {article.source}
                                        </span>

                                        <span>•</span>

                                        <span>
                                            {formatDate(
                                                article.published_at
                                            )}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-semibold leading-snug">
                                        {article.title}
                                    </h3>
                                    
                                    {article.description && (
                                        <p className="mt-2 line-clamp-2 text-sm text-muted foreground">
                                            {article.description}
                                        </p>
                                    )}

                                    <a 
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                                    >
                                        Read article
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}