import type { Metadata } from 'next';
import { asLocale, authorName, ogImageOf, openGraphLocale, siteName, xHandle } from './site';

export const FEED_PATH = '/feed.xml';

interface PageMetadata {
    locale: string;
    /** Path of this page, used as its canonical URL. */
    path: string;
    title: string;
    description: string;
    /** The same page in each language, when it exists in more than one. */
    languages?: { es: string; en: string };
    /** A generated social image (`app/og`), or a ready-made one. */
    image: { url: string; width: number; height: number; alt?: string };
    openGraph?: Metadata['openGraph'];
    /** Extra alternate representations of this page, by MIME type. */
    types?: Record<string, string>;
}

/** Canonical, hreflang, Open Graph, X card and feed links, the same way on every page. */
export function pageMetadata({ locale, path, title, description, languages, image, openGraph, types }: PageMetadata): Metadata {
    const current = asLocale(locale);
    const other = current === 'es' ? 'en' : 'es';
    return {
        title,
        description,
        alternates: {
            canonical: path,
            ...(languages ? { languages: { 'es-ES': languages.es, en: languages.en, 'x-default': languages.en } } : {}),
            types: {
                ...(current === 'es' ? { 'application/rss+xml': FEED_PATH } : {}),
                ...types,
            },
        },
        openGraph: {
            type: 'website',
            url: path,
            siteName,
            title,
            description,
            locale: openGraphLocale[current],
            ...(languages ? { alternateLocale: [openGraphLocale[other]] } : {}),
            images: [{ ...image, alt: image.alt ?? title }],
            ...openGraph,
        } as Metadata['openGraph'],
        twitter: {
            card: 'summary_large_image',
            site: xHandle,
            creator: xHandle,
            title,
            description,
            images: [image.url],
        },
    };
}

/** The defaults every page inherits; pages add their own title, description and alternates. */
export const baseMetadata = (siteUrl: string): Metadata => ({
    metadataBase: new URL(siteUrl),
    applicationName: siteName,
    authors: [{ name: authorName }],
    creator: authorName,
    publisher: siteName,
    manifest: '/site.webmanifest',
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
            { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
        ],
        apple: '/apple-touch-icon.png',
    },
    formatDetection: { email: false, telephone: false, address: false },
});

export { ogImageOf };
