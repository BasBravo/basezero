export const caseStudySegment = {
    es: 'proyectos',
    en: 'projects',
} as const;

export type CaseStudyLocale = keyof typeof caseStudySegment;

export const asCaseStudyLocale = (locale: string): CaseStudyLocale => (locale === 'en' ? 'en' : 'es');

export function getCaseStudyPath(locale: string, slug: string) {
    const current = asCaseStudyLocale(locale);
    return `/${current}/${caseStudySegment[current]}/${slug}`;
}

export function getCaseStudyMarkdownPath(locale: string, slug: string) {
    const current = asCaseStudyLocale(locale);
    return `/${current}/${caseStudySegment[current]}/md/${slug}.md`;
}
