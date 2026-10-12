import type { Article } from '@/features/articles/types';
import { absolute, aboutUrl, articleMarkdownPath, asLocale, authorName, contactEmail, expertise, htmlLanguage, ids, ogImageOf, services, siteName, siteUrl, socialProfiles } from './site';

type Json = Record<string, unknown>;

/** Serialises JSON-LD for a <script> tag without letting the content close it. */
export const jsonLd = (data: Json | Json[]) => JSON.stringify(data).replace(/</g, '\\u003c');

const personRef = { '@id': ids.person };
const organizationRef = { '@id': ids.organization };

/** The studio, the site and its founder: present on every page, linked by id. */
export function siteGraph(locale: string, description: string): Json {
    const current = asLocale(locale);
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': ['Organization', 'ProfessionalService'],
                '@id': ids.organization,
                name: siteName,
                url: absolute(`/${current}`),
                logo: absolute('/android-chrome-512x512.png'),
                image: absolute('/android-chrome-512x512.png'),
                email: contactEmail,
                description,
                founder: personRef,
                address: { '@type': 'PostalAddress', addressCountry: 'ES' },
                areaServed: [{ '@type': 'Country', name: 'Spain' }, 'Worldwide'],
                knowsLanguage: ['es', 'en'],
                knowsAbout: expertise,
                sameAs: socialProfiles.map(profile => profile.href),
                hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: current === 'es' ? 'Servicios' : 'Services',
                    itemListElement: services[current].map(service => ({
                        '@type': 'Offer',
                        itemOffered: { '@type': 'Service', name: service.name, description: service.description, provider: organizationRef },
                    })),
                },
            },
            {
                '@type': 'WebSite',
                '@id': ids.website,
                name: siteName,
                url: siteUrl,
                inLanguage: ['es-ES', 'en'],
                publisher: organizationRef,
            },
            {
                '@type': 'Person',
                '@id': ids.person,
                name: authorName,
                url: aboutUrl(current),
                image: absolute('/about/bas-bravo.jpg'),
                jobTitle: current === 'es' ? 'Diseñador y desarrollador de producto' : 'Product designer and developer',
                worksFor: organizationRef,
                sameAs: socialProfiles.map(profile => profile.href),
            },
        ],
    };
}

export function articleGraph(article: Article): Json {
    const url = absolute(article.href);
    const home = absolute(`/${article.locale}`);
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BlogPosting',
                '@id': `${url}#article`,
                headline: article.title,
                description: article.description,
                url,
                mainEntityOfPage: url,
                datePublished: article.date,
                dateModified: article.updated ?? article.date,
                inLanguage: htmlLanguage[asLocale(article.locale)],
                articleSection: article.category,
                keywords: article.keywords,
                wordCount: article.wordCount,
                image: ogImageOf(article.locale, article.slug).url,
                author: { ...personRef, '@type': 'Person', name: authorName, url: aboutUrl(article.locale) },
                publisher: organizationRef,
                isPartOf: { '@id': ids.website },
                encoding: { '@type': 'MediaObject', encodingFormat: 'text/markdown', contentUrl: absolute(articleMarkdownPath(article.locale, article.slug)) },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: siteName, item: home },
                    { '@type': 'ListItem', position: 2, name: article.locale === 'es' ? 'Artículos' : 'Articles', item: `${home}#articles` },
                    { '@type': 'ListItem', position: 3, name: article.title, item: url },
                ],
            },
        ],
    };
}
