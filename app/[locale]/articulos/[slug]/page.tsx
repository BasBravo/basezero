import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ArticlePage } from '@/features/articles/components/ArticlePage';
import { getArticle, getArticleSlugs, getArticleSummaries } from '@/features/articles/lib/articles';
import { routing } from '@/i18n/routing';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://basezero.dev';

type ArticlePageProps = {
    params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
    return routing.locales.flatMap(locale =>
        getArticleSlugs(locale).map(slug => ({ locale, slug })),
    );
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const article = getArticle(locale, slug);
    if (!article) notFound();
    const canonical = article.href;

    return {
        title: `${article.title} — Basezero`,
        description: article.description,
        authors: [{ name: article.author, url: `${siteUrl}/es` }],
        alternates: { canonical },
        openGraph: {
            type: 'article',
            url: `${siteUrl}${canonical}`,
            siteName: 'Basezero',
            title: article.title,
            description: article.description,
            locale: 'es_ES',
            publishedTime: article.date,
            authors: [article.author],
        },
        twitter: {
            card: 'summary',
            title: article.title,
            description: article.description,
        },
    };
}

export default async function ArticleRoute({ params }: ArticlePageProps) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    const article = getArticle(locale, slug);
    if (!article) notFound();
    const [t, portfolioT] = await Promise.all([
        getTranslations({ locale, namespace: 'Article' }),
        getTranslations({ locale, namespace: 'Portfolio' }),
    ]);
    const otherArticles = getArticleSummaries(locale).filter(candidate => candidate.slug !== article.slug);

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        dateModified: article.date,
        inLanguage: article.locale,
        mainEntityOfPage: `${siteUrl}${article.href}`,
        author: {
            '@type': 'Person',
            name: article.author,
            url: `${siteUrl}/es`,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Basezero',
            url: `${siteUrl}/es`,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
                }}
            />
            <ArticlePage
                article={article}
                otherArticles={otherArticles}
                copy={{
                    skip: t('skip'),
                    homeLabel: t('homeLabel'),
                    backToStudio: t('backToStudio'),
                    themeToggle: t('themeToggle'),
                    articleIndex: t('articleIndex'),
                    readingTime: t('readingTime', { minutes: article.readingMinutes }),
                    authorLabel: t('authorLabel'),
                    writtenBy: t('writtenBy'),
                    sourcesLabel: t('sourcesLabel'),
                    footnoteBack: t('footnoteBack'),
                    scrollbar: portfolioT('scrollbar'),
                    detailsLabel: t('detailsLabel'),
                    publishedLabel: t('publishedLabel'),
                    readingLabel: t('readingLabel'),
                    categoryLabel: t('categoryLabel'),
                    otherArticles: t('otherArticles'),
                    noOtherArticles: t('noOtherArticles'),
                    menuOpen: portfolioT('menu.open'),
                    menuClose: portfolioT('menu.close'),
                    menuLabel: portfolioT('menu.label'),
                    menuHome: portfolioT('menu.home'),
                    menuWork: portfolioT('menu.work'),
                    menuArticles: portfolioT('menu.articles'),
                    menuAbout: portfolioT('menu.about'),
                    menuContact: portfolioT('menu.contact'),
                }}
            />
        </>
    );
}
