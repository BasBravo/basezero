import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://basezero.dev';

const metadataByLocale = {
    es: {
        title: 'Basezero — Estudio independiente de producto digital',
        description: 'Definición, diseño y desarrollo de MVPs, plataformas y herramientas web desde cero, de la estrategia al lanzamiento.',
        locale: 'es_ES',
    },
    en: {
        title: 'Basezero — Independent digital product studio',
        description: 'Strategy, design and development of MVPs, platforms and web tools from scratch, from strategy through launch.',
        locale: 'en_US',
    },
} as const;

export function generateStaticParams() {
    return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const currentLocale = locale === 'es' ? 'es' : 'en';
    const content = metadataByLocale[currentLocale];
    const canonical = `/${currentLocale}`;

    return {
        title: content.title,
        description: content.description,
        alternates: {
            canonical,
            languages: {
                'es-ES': '/es',
                en: '/en',
                'x-default': '/en',
            },
        },
        openGraph: {
            type: 'website',
            url: `${siteUrl}${canonical}`,
            siteName: 'Basezero',
            title: content.title,
            description: content.description,
            locale: content.locale,
            alternateLocale: currentLocale === 'es' ? ['en_US'] : ['es_ES'],
        },
        twitter: {
            card: 'summary',
            title: content.title,
            description: content.description,
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) notFound();
    setRequestLocale(locale);
    const content = metadataByLocale[locale as keyof typeof metadataByLocale];
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Basezero',
        url: `${siteUrl}/${locale}`,
        email: 'hello@basezero.dev',
        description: content.description,
        founder: {
            '@type': 'Person',
            name: 'Bas Bravo',
        },
        sameAs: ['https://x.com/basbravo_'],
    };

    return (
        <NextIntlClientProvider>
            <script
                dangerouslySetInnerHTML={{
                    __html: `document.documentElement.lang=${JSON.stringify(locale)}`,
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
                }}
            />
            {children}
        </NextIntlClientProvider>
    );
}
