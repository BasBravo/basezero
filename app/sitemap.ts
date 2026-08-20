import type { MetadataRoute } from 'next';
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

    return [...landingPages, ...articlePages];
}
