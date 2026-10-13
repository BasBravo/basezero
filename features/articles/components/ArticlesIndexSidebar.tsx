'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { getAboutPath } from '@/features/about/lib/paths';
import aboutStyles from '@/features/about/components/about.module.css';
import { ColumnMenuPanel, ColumnMenuToggle } from '@/features/portfolio/components/ColumnMenu';
import type { ArticlesIndexCopy } from './ArticlesIndexPage';
import { ArticleThemeToggle } from './ArticleThemeToggle';
import styles from './article.module.css';

type Props = {
    locale: string;
    copy: ArticlesIndexCopy;
    count: string;
    latest: string;
    rssHref?: string;
};

function BackLink({ href, label }: { href: string; label: string }) {
    return (
        <Link href={href} className={styles.backLink}>
            <Icon name="arrow_back" />
            <span>{label}</span>
        </Link>
    );
}

function Archive({ copy, count, latest, rssHref }: Omit<Props, 'locale'>) {
    return (
        <>
            <section className={styles.articleDetails}>
                <dl className={styles.articleFacts}>
                    <div className={styles.articleByline}>
                        <dt>{copy.archiveLabel}</dt>
                        <dd>{count}</dd>
                    </div>
                    <div className={styles.articleMeta}>
                        <div>
                            <dd>{latest}</dd>
                        </div>
                    </div>
                </dl>
            </section>

            {rssHref ? (
                <ul className={aboutStyles.sidebarLinks}>
                    <li>
                        <a href={rssHref} type="application/rss+xml">
                            {copy.rss}
                            <span>{copy.rssHint}</span>
                        </a>
                    </li>
                </ul>
            ) : null}
        </>
    );
}

/** Mobile only: the archive facts and the way back, after the last article of the list. */
export function ArticlesIndexEnd({ locale, copy, count, latest, rssHref }: Props) {
    return (
        <footer className={styles.mobileArticleEnd}>
            <Archive copy={copy} count={count} latest={latest} rssHref={rssHref} />
            <BackLink href={`/${locale}`} label={copy.backToStudio} />
        </footer>
    );
}

export function ArticlesIndexSidebar({ locale, copy, count, latest, rssHref }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const localeRoot = `/${locale}`;

    return (
        <>
            <div className={styles.menuLayer}>
                <ColumnMenuPanel
                    open={menuOpen}
                    label={copy.menuLabel}
                    items={[
                        { href: `${localeRoot}#top`, label: copy.menuHome },
                        { href: `${localeRoot}#work`, label: copy.menuWork },
                        { href: `${localeRoot}/articulos`, label: copy.menuArticles },
                        { href: `${localeRoot}#about`, label: copy.menuAbout },
                        { href: getAboutPath(locale === 'es' ? 'es' : 'en'), label: copy.menuMe },
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
                    <Archive copy={copy} count={count} latest={latest} rssHref={rssHref} />
                </div>

                <div className={styles.sidebarFooter}>
                    <BackLink href={localeRoot} label={copy.backToStudio} />
                </div>
            </aside>

            <div className={styles.mobileArticleIntro}>
                <section className={styles.articleDetails}>
                    <p className={styles.mobileArticleTitle} aria-hidden="true">{copy.title}</p>
                    <p className={styles.sidebarDescription}>{copy.lead}</p>
                </section>
            </div>
        </>
    );
}
