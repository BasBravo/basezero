'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { ColumnMenuPanel, ColumnMenuToggle } from '@/features/portfolio/components/ColumnMenu';
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

export function ArticleSidebar({ article, otherArticles, formattedDate, copy }: ArticleSidebarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const localeRoot = `/${article.locale}`;

    return (
        <aside className={styles.sidebar} aria-label={copy.detailsLabel}>
            <header className={styles.sidebarHeader}>
                <Link href={localeRoot} className={styles.brand} aria-label={copy.homeLabel}>
                    <Image src="/logotipo.svg" alt="" width={538} height={92} priority />
                </Link>
                <div className={styles.headerActions}>
                    <ArticleThemeToggle label={copy.themeToggle} />
                    <ColumnMenuToggle
                        open={menuOpen}
                        openLabel={copy.menuOpen}
                        closeLabel={copy.menuClose}
                        onToggle={() => setMenuOpen(current => !current)}
                    />
                </div>
            </header>

            <div className={styles.sidebarBody}>
                <ColumnMenuPanel
                    open={menuOpen}
                    label={copy.menuLabel}
                    items={[
                        { href: `${localeRoot}#top`, label: copy.menuHome },
                        { href: `${localeRoot}#work`, label: copy.menuWork },
                        { href: `${localeRoot}#articles`, label: copy.menuArticles },
                        { href: `${localeRoot}#about`, label: copy.menuAbout },
                        { href: `${localeRoot}#contact`, label: copy.menuContact },
                    ]}
                    onNavigate={() => setMenuOpen(false)}
                />

                <section className={styles.articleDetails}>
                    <p className={styles.sidebarLabel}>{copy.detailsLabel}</p>
                    <h2>{article.title}</h2>
                    <p className={styles.sidebarDescription}>{article.description}</p>
                    <dl className={styles.articleFacts}>
                        <div>
                            <dt>{copy.writtenBy}</dt>
                            <dd>{article.author}</dd>
                        </div>
                        <div>
                            <dt>{copy.publishedLabel}</dt>
                            <dd>{formattedDate}</dd>
                        </div>
                        <div>
                            <dt>{copy.readingLabel}</dt>
                            <dd>{copy.readingTime}</dd>
                        </div>
                        <div>
                            <dt>{copy.categoryLabel}</dt>
                            <dd>{article.category}</dd>
                        </div>
                    </dl>
                </section>

                <nav className={styles.otherArticles} aria-label={copy.otherArticles}>
                    <p className={styles.sidebarLabel}>{copy.otherArticles}</p>
                    {otherArticles.length > 0 ? (
                        <ul>
                            {otherArticles.map((otherArticle, index) => (
                                <li key={otherArticle.slug}>
                                    <Link href={otherArticle.href}>
                                        <span>{String(index + 2).padStart(2, '0')}</span>
                                        <strong>{otherArticle.title}</strong>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : <p className={styles.emptyArticles}>{copy.noOtherArticles}</p>}
                </nav>

                <Link href={`${localeRoot}#articles`} className={styles.backLink}>
                    <Icon name="arrow_back" />
                    <span>{copy.backToStudio}</span>
                </Link>
            </div>
        </aside>
    );
}
