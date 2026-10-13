import { getArticlesPath } from '@/features/articles/lib/paths';
import type { Article, ArticleSummary } from '@/features/articles/types';
import { getCaseStudyMarkdownPath } from '@/features/case-studies/lib/paths';
import type { CaseStudy } from '@/features/case-studies/types';
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
                    { '@type': 'ListItem', position: 2, name: article.locale === 'es' ? 'Artículos' : 'Articles', item: absolute(getArticlesPath(article.locale)) },
                    { '@type': 'ListItem', position: 3, name: article.title, item: url },
                ],
            },
        ],
    };
}

/** The archive of every article: a collection page that lists them, newest first. */
export function articlesIndexGraph(locale: string, title: string, description: string, articles: ArticleSummary[]): Json {
    const url = absolute(getArticlesPath(locale));
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${url}#collection`,
                name: title,
                description,
                url,
                inLanguage: htmlLanguage[asLocale(locale)],
                isPartOf: { '@id': ids.website },
                author: personRef,
                mainEntity: {
                    '@type': 'ItemList',
                    numberOfItems: articles.length,
                    itemListOrder: 'https://schema.org/ItemListOrderDescending',
                    itemListElement: articles.map((article, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        url: absolute(article.href),
                        name: article.title,
                    })),
                },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: siteName, item: absolute(`/${locale}`) },
                    { '@type': 'ListItem', position: 2, name: title, item: url },
                ],
            },
        ],
    };
}

/** A case study: the write-up (an Article about the work) and the product it describes (a WebApplication made by the studio). */
export function caseStudyGraph(study: CaseStudy): Json {
    const url = absolute(study.href);
    const home = absolute(`/${study.locale}`);
    const product = `${url}#product`;
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Article',
                '@id': `${url}#case-study`,
                headline: study.title,
                description: study.description,
                url,
                mainEntityOfPage: url,
                dateModified: study.date,
                inLanguage: htmlLanguage[asLocale(study.locale)],
                articleSection: study.locale === 'es' ? 'Casos de estudio' : 'Case studies',
                keywords: study.keywords,
                wordCount: study.wordCount,
                image: absolute(study.cover),
                author: { ...personRef, '@type': 'Person', name: authorName, url: aboutUrl(study.locale) },
                publisher: organizationRef,
                isPartOf: { '@id': ids.website },
                about: { '@id': product },
                encoding: { '@type': 'MediaObject', encodingFormat: 'text/markdown', contentUrl: absolute(getCaseStudyMarkdownPath(study.locale, study.slug)) },
            },
            {
                '@type': 'WebApplication',
                '@id': product,
                name: study.name,
                url: study.url,
                description: study.description,
                applicationCategory: study.facets[0],
                operatingSystem: 'Web',
                creator: organizationRef,
                author: personRef,
                image: absolute(study.cover),
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: siteName, item: home },
                    { '@type': 'ListItem', position: 2, name: study.locale === 'es' ? 'Proyectos' : 'Projects', item: `${home}#work` },
                    { '@type': 'ListItem', position: 3, name: study.name, item: url },
                ],
            },
        ],
    };
}
