import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ArticlePage } from '@/features/articles/components/ArticlePage';
import { getFigureCopy } from '@/features/articles/figures/copy';
import { getArticle, getArticleSlugs, getArticleSummaries } from '@/features/articles/lib/articles';
import { ogImageOf, pageMetadata } from '@/features/seo/lib/metadata';
import { aboutUrl, articleMarkdownPath } from '@/features/seo/lib/site';
import { articleGraph, jsonLd } from '@/features/seo/lib/structured-data';
import { routing } from '@/i18n/routing';

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

    const metadata = pageMetadata({
        locale,
        path: article.href,
        title: `${article.title} — Basezero`,
        description: article.description,
        image: { ...ogImageOf(locale, article.slug), alt: article.title },
        types: { 'text/markdown': articleMarkdownPath(locale, article.slug) },
        openGraph: {
            type: 'article',
            title: article.title,
            publishedTime: article.date,
            modifiedTime: article.updated ?? article.date,
            section: article.category,
            tags: article.keywords,
            authors: [aboutUrl(locale)],
        },
    });
    return { ...metadata, authors: [{ name: article.author, url: aboutUrl(locale) }], keywords: article.keywords };
}

export default async function ArticleRoute({ params }: ArticlePageProps) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    const article = getArticle(locale, slug);
    if (!article) notFound();
    const [t, portfolioT, figures] = await Promise.all([
        getTranslations({ locale, namespace: 'Article' }),
        getTranslations({ locale, namespace: 'Portfolio' }),
        getFigureCopy(locale),
    ]);
    const otherArticles = getArticleSummaries(locale).filter(candidate => candidate.slug !== article.slug);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: jsonLd(articleGraph(article)),
                }}
            />
            <ArticlePage
                figures={figures}
                article={article}
                otherArticles={otherArticles}
                copy={{
                    skip: t('skip'),
                    homeLabel: t('homeLabel'),
                    backToStudio: t('backToStudio'),
                    themeToggle: t('themeToggle'),
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
                    menuMe: portfolioT('menu.me'),
                }}
            />
        </>
    );
}
