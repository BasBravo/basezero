'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { getAboutPath } from '@/features/about/lib/paths';
import { ColumnMenuPanel, ColumnMenuToggle } from '@/features/portfolio/components/ColumnMenu';
import { getArticlesPath } from '../lib/paths';
import type { Article, ArticleSummary } from '../types';
import type { ArticlePageCopy } from './ArticlePage';
import { ArticleThemeToggle } from './ArticleThemeToggle';
import styles from './article.module.css';

type ArticleSidebarProps = {
    article: Article;
    otherArticles: ArticleSummary[];
    formattedDate: string;
    copy: ArticlePageCopy;
};

function BackLink({ href, label }: { href: string; label: string }) {
    return (
        <Link href={href} className={styles.backLink}>
            <Icon name="arrow_back" />
            <span>{label}</span>
        </Link>
    );
}

function ArticleFacts({ article, formattedDate, copy }: Omit<ArticleSidebarProps, 'otherArticles'>) {
    return (
        <dl className={styles.articleFacts}>
            <div className={styles.articleByline}>
                <dt>{copy.writtenBy}</dt>
                <dd>{article.author}</dd>
            </div>
            <div className={styles.articleMeta}>
                <div>
                    <dt className={styles.visuallyHidden}>{copy.publishedLabel}</dt>
                    <dd>{formattedDate}</dd>
                </div>
                <div>
                    <dt className={styles.visuallyHidden}>{copy.readingLabel}</dt>
                    <dd>{copy.readingTime}</dd>
                </div>
                <div>
                    <dt className={styles.visuallyHidden}>{copy.categoryLabel}</dt>
                    <dd>{article.category}</dd>
                </div>
            </div>
        </dl>
    );
}

function OtherArticles({ article, otherArticles, copy }: Pick<ArticleSidebarProps, 'article' | 'otherArticles' | 'copy'>) {
    const publicationNumberBySlug = new Map(
        [...otherArticles, article]
            .sort((first, second) => first.date.localeCompare(second.date) || first.slug.localeCompare(second.slug))
            .map((publishedArticle, index) => [publishedArticle.slug, String(index + 1).padStart(2, '0')]),
    );

    return (
        <nav className={styles.otherArticles} aria-label={copy.otherArticles}>
            <p className={styles.sidebarLabel}>{copy.otherArticles}</p>
            {otherArticles.length > 0 ? (
                <ul>
                    {otherArticles.map(otherArticle => (
                        <li key={otherArticle.slug}>
                            <Link href={otherArticle.href}>
                                <span>{publicationNumberBySlug.get(otherArticle.slug)}</span>
                                <strong>{otherArticle.title}</strong>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : <p className={styles.emptyArticles}>{copy.noOtherArticles}</p>}
        </nav>
    );
}

/** Desktop sidebar content: the facts and the other articles. On mobile these move to the end of the article. */
function ArticleContext(props: ArticleSidebarProps) {
    const { article, formattedDate, copy } = props;

    return (
        <>
            <section className={styles.articleDetails}>
                <ArticleFacts article={article} formattedDate={formattedDate} copy={copy} />
            </section>
            <OtherArticles article={article} otherArticles={props.otherArticles} copy={copy} />
        </>
    );
}

/** Mobile only: the facts, the other articles and the way back, after the last line of the article. */
export function ArticleEnd({ article, otherArticles, formattedDate, copy }: ArticleSidebarProps) {
    return (
        <footer className={styles.mobileArticleEnd}>
            <section className={styles.articleDetails}>
                <ArticleFacts article={article} formattedDate={formattedDate} copy={copy} />
            </section>
            <OtherArticles article={article} otherArticles={otherArticles} copy={copy} />
            <BackLink href={`/${article.locale}#articles`} label={copy.backToStudio} />
        </footer>
    );
}

export function ArticleSidebar({ article, otherArticles, formattedDate, copy }: ArticleSidebarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const localeRoot = `/${article.locale}`;

    return (
        <>
            <div className={styles.menuLayer}>
                <ColumnMenuPanel
                    open={menuOpen}
                    label={copy.menuLabel}
                    items={[
                        { href: `${localeRoot}#top`, label: copy.menuHome },
                        { href: `${localeRoot}#work`, label: copy.menuWork },
                        { href: getArticlesPath(article.locale), label: copy.menuArticles },
                        { href: `${localeRoot}#about`, label: copy.menuAbout },
                        { href: getAboutPath(article.locale === 'es' ? 'es' : 'en'), label: copy.menuMe },
                        { href: `${localeRoot}#contact`, label: copy.menuContact },
                    ]}
                    onNavigate={() => setMenuOpen(false)}
                />
            </div>

            <aside className={styles.sidebar} aria-label={copy.detailsLabel} data-menu-open={menuOpen ? 'true' : undefined}>
                <ArticleThemeToggle label={copy.themeToggle} />

                <header className={styles.sidebarHeader}>
                    <ColumnMenuToggle
                        open={menuOpen}
                        openLabel={copy.menuOpen}
                        closeLabel={copy.menuClose}
                        onToggle={() => setMenuOpen(current => !current)}
                    />
                    <Link href={localeRoot} className={styles.brand} aria-label={copy.homeLabel}>
                        <Image src="/logotipo.svg" alt="" width={538} height={92} priority />
                    </Link>
                </header>

                <div className={styles.sidebarBody}>
                    <ArticleContext
                        article={article}
                        otherArticles={otherArticles}
                        formattedDate={formattedDate}
                        copy={copy}
                    />
                </div>

                <div className={styles.sidebarFooter}>
                    <BackLink href={`${localeRoot}#articles`} label={copy.backToStudio} />
                </div>
            </aside>

            <div className={styles.mobileArticleIntro}>
                <section className={styles.articleDetails}>
                    <p className={styles.mobileArticleTitle} aria-hidden="true">{article.title}</p>
                    <p className={styles.sidebarDescription}>{article.description}</p>
                </section>
            </div>
        </>
    );
}
