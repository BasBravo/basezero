import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://basezero.dev';
const languages = {
    'es-ES': `${siteUrl}/es`,
    en: `${siteUrl}/en`,
    'x-default': `${siteUrl}/en`,
};

export default function sitemap(): MetadataRoute.Sitemap {
    return [
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
}
