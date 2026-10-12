import type { Metadata } from 'next';
import { getAboutPath, type AboutLocale } from './paths';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://basezero.dev';
export const contactEmail = 'hello@basezero.dev';

export const aboutSocialLinks = [
    { label: 'GitHub', handle: '@BasBravo', href: 'https://github.com/BasBravo' },
    { label: 'X', handle: '@basbravo_', href: 'https://x.com/basbravo_' },
    { label: 'Instagram', handle: '@bas.bravo', href: 'https://www.instagram.com/bas.bravo/' },
    { label: 'Behance', handle: '@basbravo', href: 'https://www.behance.net/basbravo' },
];

const openGraphLocale = { es: 'es_ES', en: 'en_US' } as const;

export function buildAboutMetadata(locale: AboutLocale, title: string, description: string): Metadata {
    const canonical = getAboutPath(locale);
    const image = { url: `${siteUrl}/about/bas-bravo.jpg`, width: 1024, height: 1024, alt: 'Bas Bravo' };

    return {
        title,
        description,
        authors: [{ name: 'Bas Bravo', url: `${siteUrl}${canonical}` }],
        alternates: {
            canonical,
            languages: {
                'es-ES': getAboutPath('es'),
                en: getAboutPath('en'),
                'x-default': getAboutPath('en'),
            },
        },
        robots: { index: true, follow: true },
        openGraph: {
            type: 'profile',
            url: `${siteUrl}${canonical}`,
            siteName: 'Basezero',
            title,
            description,
            locale: openGraphLocale[locale],
            alternateLocale: [openGraphLocale[locale === 'es' ? 'en' : 'es']],
            firstName: 'Bas',
            lastName: 'Bravo',
            images: [image],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image.url],
        },
    };
}

export function buildAboutStructuredData(locale: AboutLocale, title: string, description: string, jobTitle: string) {
    const url = `${siteUrl}${getAboutPath(locale)}`;
    const person = {
        '@type': 'Person',
        '@id': `${siteUrl}/#bas-bravo`,
        name: 'Bas Bravo',
        url,
        image: `${siteUrl}/about/bas-bravo.jpg`,
        jobTitle,
        description,
        email: contactEmail,
        knowsLanguage: ['es', 'gl'],
        address: { '@type': 'PostalAddress', addressCountry: 'ES' },
        worksFor: { '@type': 'Organization', name: 'Basezero', url: `${siteUrl}/${locale}` },
        sameAs: aboutSocialLinks.map(link => link.href),
    };

    return [
        {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            name: title,
            description,
            url,
            inLanguage: locale === 'es' ? 'es-ES' : 'en',
            mainEntity: person,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Basezero', item: `${siteUrl}/${locale}` },
                { '@type': 'ListItem', position: 2, name: 'Bas Bravo', item: url },
            ],
        },
    ];
}
