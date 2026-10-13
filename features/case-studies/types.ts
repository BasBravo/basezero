export type CaseStudySummary = {
    slug: string;
    href: string;
    locale: 'es' | 'en';
    title: string;
    description: string;
    name: string;
    url: string;
    year: string;
    role: string;
    facets: string[];
    stack: string[];
    status: string;
    cover: string;
    order: number;
    date: string;
    keywords?: string[];
};

export type CaseStudy = CaseStudySummary & {
    content: string;
    wordCount: number;
    /** Real size of each screenshot in the body, so it is shown whole and without layout shift. */
    images: Record<string, { width: number; height: number }>;
};
