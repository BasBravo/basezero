import type { MetadataRoute } from 'next';
import { getAboutPath } from '@/features/about/lib/paths';
import { getArticleSummaries } from '@/features/articles/lib/articles';
import { getArticlesPath } from '@/features/articles/lib/paths';
import { getCaseStudy, getCaseStudySummaries } from '@/features/case-studies/lib/case-studies';
import { getCaseStudyPath } from '@/features/case-studies/lib/paths';

export const dynamic = 'force-static';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://basezero.dev';
const languages = {
    'es-ES': `${siteUrl}/es`,
    en: `${siteUrl}/en`,
    'x-default': `${siteUrl}/en`,
};

export default function sitemap(): MetadataRoute.Sitemap {
    // The home lists the articles, so it changes when a new one is published.
    const latest = (locale: string) => getArticleSummaries(locale)[0]?.date;
    const landingPages: MetadataRoute.Sitemap = [
        {
            url: `${siteUrl}/es`,
            lastModified: latest('es'),
            changeFrequency: 'monthly',
            priority: 1,
            alternates: { languages },
        },
        {
            url: `${siteUrl}/en`,
            changeFrequency: 'monthly',
            priority: 1,
            alternates: { languages },
        },
    ];

    const articlePages: MetadataRoute.Sitemap = ['es', 'en'].flatMap(locale =>
        getArticleSummaries(locale).map(article => ({
            url: `${siteUrl}${article.href}`,
            lastModified: article.updated ?? article.date,
            changeFrequency: 'yearly' as const,
            priority: 0.7,
        })),
    );

    const articleIndexPages: MetadataRoute.Sitemap = (['es', 'en'] as const)
        .filter(locale => getArticleSummaries(locale).length > 0)
        .map(locale => ({
            url: `${siteUrl}${getArticlesPath(locale)}`,
            lastModified: latest(locale),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

    const aboutLanguages = {
        'es-ES': `${siteUrl}${getAboutPath('es')}`,
        en: `${siteUrl}${getAboutPath('en')}`,
        'x-default': `${siteUrl}${getAboutPath('en')}`,
    };
    const aboutPages: MetadataRoute.Sitemap = (['es', 'en'] as const).map(locale => ({
        url: `${siteUrl}${getAboutPath(locale)}`,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        alternates: { languages: aboutLanguages },
    }));

    const caseStudyPages: MetadataRoute.Sitemap = (['es', 'en'] as const).flatMap(locale =>
        getCaseStudySummaries(locale).map(study => ({
            url: `${siteUrl}${study.href}`,
            lastModified: study.date,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
            ...(getCaseStudy(locale === 'es' ? 'en' : 'es', study.slug)
                ? { alternates: { languages: { 'es-ES': `${siteUrl}${getCaseStudyPath('es', study.slug)}`, en: `${siteUrl}${getCaseStudyPath('en', study.slug)}`, 'x-default': `${siteUrl}${getCaseStudyPath('en', study.slug)}` } } }
                : {}),
        })),
    );

    return [...landingPages, ...aboutPages, ...caseStudyPages, ...articleIndexPages, ...articlePages];
}
