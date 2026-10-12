import type { Metadata } from 'next';
import { pageMetadata } from '@/features/seo/lib/metadata';
import { contactEmail, ids, siteUrl, socialProfiles } from '@/features/seo/lib/site';
import { getAboutPath, type AboutLocale } from './paths';

export { contactEmail, siteUrl };
export const aboutSocialLinks = socialProfiles;

export function buildAboutMetadata(locale: AboutLocale, title: string, description: string): Metadata {
    const metadata = pageMetadata({
        locale,
        path: getAboutPath(locale),
        title,
        description,
        languages: { es: getAboutPath('es'), en: getAboutPath('en') },
        image: { url: `${siteUrl}/about/bas-bravo.jpg`, width: 1024, height: 1024, alt: 'Bas Bravo' },
        openGraph: { type: 'profile', firstName: 'Bas', lastName: 'Bravo' },
    });
    return { ...metadata, robots: { index: true, follow: true } };
}

export function buildAboutStructuredData(locale: AboutLocale, title: string, description: string, jobTitle: string) {
    const url = `${siteUrl}${getAboutPath(locale)}`;
    const person = {
        '@type': 'Person',
        '@id': ids.person,
        name: 'Bas Bravo',
        url,
        image: `${siteUrl}/about/bas-bravo.jpg`,
        jobTitle,
        description,
        email: contactEmail,
        knowsLanguage: ['es', 'gl'],
        address: { '@type': 'PostalAddress', addressCountry: 'ES' },
        worksFor: { '@id': ids.organization },
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
