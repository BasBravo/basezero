import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { baseMetadata } from '@/features/seo/lib/metadata';
import { htmlLanguage, siteUrl } from '@/features/seo/lib/site';
import { jsonLd, siteGraph } from '@/features/seo/lib/structured-data';
import { routing } from '@/i18n/routing';
import { ThemeBootstrap } from '../theme-bootstrap';
import '../globals.css';

export const metadata: Metadata = baseMetadata(siteUrl);

export function generateStaticParams() {
    return routing.locales.map(locale => ({ locale }));
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
    const t = await getTranslations({ locale, namespace: 'Portfolio' });

    return (
        <html lang={htmlLanguage[locale]} data-theme="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
            <body>
                <ThemeBootstrap />
                <NextIntlClientProvider>
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteGraph(locale, t('meta.description'))) }} />
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
