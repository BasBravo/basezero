export type ArticleSummary = {
    slug: string;
    href: string;
    title: string;
    description: string;
    date: string;
    author: string;
    locale: string;
    category: string;
    readingMinutes: number;
    /** Optional: when the article was last revised in substance. */
    updated?: string;
    /** Optional: the searches the article answers, for structured data and agents. */
    keywords?: string[];
};

export type Article = ArticleSummary & {
    content: string;
    wordCount: number;
};
