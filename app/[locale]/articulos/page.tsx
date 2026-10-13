import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ArticlesIndexPage, type ArticlesIndexCopy } from '@/features/articles/components/ArticlesIndexPage';
import { getArticleSummaries } from '@/features/articles/lib/articles';
import { getArticlesPath } from '@/features/articles/lib/paths';
import { FEED_PATH, ogImageOf, pageMetadata } from '@/features/seo/lib/metadata';
import { articlesIndexGraph, jsonLd } from '@/features/seo/lib/structured-data';
import { routing } from '@/i18n/routing';

type Props = { params: Promise<{ locale: string }> };

export const dynamicParams = false;

/** Only the languages that have articles get an archive page. */
export function generateStaticParams() {
    return routing.locales.filter(locale => getArticleSummaries(locale).length > 0).map(locale => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'ArticlesIndex' });
    return pageMetadata({
        locale,
        path: getArticlesPath(locale),
        title: t('metaTitle'),
        description: t('metaDescription'),
        image: { ...ogImageOf(locale, 'articulos'), alt: t('title') },
    });
}

function formatDate(date: string, locale: string) {
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));
}

export default async function ArticlesIndexRoute({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);
    const articles = getArticleSummaries(locale);
    if (articles.length === 0) notFound();

    const [t, portfolioT] = await Promise.all([
        getTranslations({ locale, namespace: 'ArticlesIndex' }),
        getTranslations({ locale, namespace: 'Portfolio' }),
    ]);

    const copy: ArticlesIndexCopy = {
        skip: t('skip'),
        homeLabel: t('homeLabel'),
        backToStudio: t('backToStudio'),
        themeToggle: t('themeToggle'),
        scrollbar: portfolioT('scrollbar'),
        detailsLabel: t('detailsLabel'),
        archiveLabel: t('archiveLabel'),
        title: t('title'),
        lead: t('lead'),
        listLabel: t('listLabel'),
        read: t('read'),
        rss: t('rss'),
        menuOpen: portfolioT('menu.open'),
        menuClose: portfolioT('menu.close'),
        menuLabel: portfolioT('menu.label'),
        menuHome: portfolioT('menu.home'),
        menuWork: portfolioT('menu.work'),
        menuArticles: portfolioT('menu.articles'),
        menuAbout: portfolioT('menu.about'),
        menuContact: portfolioT('menu.contact'),
        menuMe: portfolioT('menu.me'),
        studio: portfolioT('menu.home'),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLd(articlesIndexGraph(locale, t('title'), t('metaDescription'), articles)) }}
            />
            <ArticlesIndexPage
                locale={locale}
                copy={copy}
                articles={articles}
                count={t('count', { count: articles.length })}
                latest={t('latest', { date: formatDate(articles[0]!.date, locale) })}
                readingTimes={Object.fromEntries(articles.map(article => [article.slug, t('readingTime', { minutes: article.readingMinutes })]))}
                rssHref={locale === 'es' ? FEED_PATH : undefined}
            />
        </>
    );
}
