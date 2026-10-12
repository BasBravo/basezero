import type { MetadataRoute } from 'next';
import { getAboutPath } from '@/features/about/lib/paths';
import { getArticleSummaries } from '@/features/articles/lib/articles';

export const dynamic = 'force-static';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://basezero.dev';
const languages = {
    'es-ES': `${siteUrl}/es`,
    en: `${siteUrl}/en`,
    'x-default': `${siteUrl}/en`,
};

export default function sitemap(): MetadataRoute.Sitemap {
    const landingPages: MetadataRoute.Sitemap = [
        {
            url: `${siteUrl}/es`,
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
            lastModified: article.date,
            changeFrequency: 'yearly' as const,
            priority: 0.7,
        })),
    );

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

    return [...landingPages, ...aboutPages, ...articlePages];
}
