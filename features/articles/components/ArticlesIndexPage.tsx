import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { PortfolioScrollbar } from '@/features/portfolio/components/PortfolioScrollbar';
import type { ArticleSummary } from '../types';
import { ArticleTitleBreadcrumb } from './ArticleTitleBreadcrumb';
import { ArticlesIndexEnd, ArticlesIndexSidebar } from './ArticlesIndexSidebar';
import styles from './article.module.css';
import listStyles from './articles-index.module.css';

export type ArticlesIndexCopy = {
    skip: string;
    homeLabel: string;
    backToStudio: string;
    themeToggle: string;
    scrollbar: string;
    detailsLabel: string;
    archiveLabel: string;
    title: string;
    lead: string;
    listLabel: string;
    read: string;
    rss: string;
    menuOpen: string;
    menuClose: string;
    menuLabel: string;
    menuHome: string;
    menuWork: string;
    menuArticles: string;
    menuAbout: string;
    menuContact: string;
    menuMe: string;
    studio: string;
};

type Props = {
    locale: string;
    copy: ArticlesIndexCopy;
    articles: ArticleSummary[];
    count: string;
    latest: string;
    readingTimes: Record<string, string>;
    rssHref?: string;
};

const yearOf = (article: ArticleSummary) => article.date.slice(0, 4);

function groupByYear(articles: ArticleSummary[]) {
    const groups = new Map<string, ArticleSummary[]>();
    for (const article of articles) {
        const year = yearOf(article);
        groups.set(year, [...(groups.get(year) ?? []), article]);
    }
    return [...groups.entries()];
}

function formatDay(date: string, locale: string) {
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en', {
        day: 'numeric',
        month: 'short',
        timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));
}

export function ArticlesIndexPage({ locale, copy, articles, count, latest, readingTimes, rssHref }: Props) {
    return (
        <div className={styles.articleShell}>
            <a href="#articles-content" className={styles.skipLink}>{copy.skip}</a>

            <div className={styles.articleScroll}>
                <PortfolioScrollbar label={copy.scrollbar} />
            </div>

            <ArticlesIndexSidebar locale={locale} copy={copy} count={count} latest={latest} rssHref={rssHref} />

            <div className={styles.headerScrim} aria-hidden="true" />

            <ArticleTitleBreadcrumb
                title={copy.title}
                sectionLabel={copy.studio}
                sectionHref={`/${locale}`}
                targetId="articles-title"
            />

            <main id="articles-content" className={styles.articleMain}>
                <section>
                    <header className={styles.articleHero}>
                        <h1 id="articles-title">{copy.title}</h1>
                        <p className={styles.articleDescription}>{copy.lead}</p>
                    </header>

                    <div className={styles.articleBody}>
                        <div className={listStyles.archive} role="region" aria-label={copy.listLabel}>
                            {groupByYear(articles).map(([year, group]) => (
                                <section key={year} className={listStyles.year} aria-labelledby={`year-${year}`}>
                                    <h2 id={`year-${year}`} className={listStyles.yearLabel}>{year}</h2>
                                    <ul className={listStyles.list}>
                                        {group.map(article => (
                                            <li key={article.slug}>
                                                <Link
                                                    className={listStyles.entry}
                                                    href={article.href}
                                                    aria-label={`${copy.read}: ${article.title}`}
                                                >
                                                    <time className={listStyles.date} dateTime={article.date}>
                                                        {formatDay(article.date, locale)}
                                                    </time>
                                                    <span className={listStyles.title}>{article.title}</span>
                                                    <span className={listStyles.description}>{article.description}</span>
                                                    <span className={listStyles.meta}>
                                                        {article.category} · {readingTimes[article.slug]}
                                                    </span>
                                                    <Icon name="arrow_outward" className={listStyles.arrow} />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ))}
                        </div>
                    </div>
                </section>

                <ArticlesIndexEnd locale={locale} copy={copy} count={count} latest={latest} rssHref={rssHref} />
            </main>
        </div>
    );
}
