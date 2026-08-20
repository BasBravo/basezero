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
};

export type Article = ArticleSummary & {
    content: string;
};
