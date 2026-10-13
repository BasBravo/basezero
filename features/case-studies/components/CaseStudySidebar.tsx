'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { getAboutPath } from '@/features/about/lib/paths';
import { ArticleThemeToggle } from '@/features/articles/components/ArticleThemeToggle';
import styles from '@/features/articles/components/article.module.css';
import { ColumnMenuPanel, ColumnMenuToggle } from '@/features/portfolio/components/ColumnMenu';
import type { CaseStudy, CaseStudySummary } from '../types';
import type { CaseStudyPageCopy } from './CaseStudyPage';

type CaseStudySidebarProps = {
    study: CaseStudy;
    others: CaseStudySummary[];
    copy: CaseStudyPageCopy;
};

function CaseStudyContext({ study, others, copy }: CaseStudySidebarProps) {
    return (
        <>
            <section className={styles.articleDetails}>
                <p className={styles.mobileArticleTitle} aria-hidden="true">{study.name}</p>
                <p className={styles.sidebarDescription}>{study.description}</p>
                <dl className={styles.articleFacts}>
                    <div className={styles.articleByline}>
                        <dt>{copy.projectLabel}</dt>
                        <dd>{study.name}</dd>
                    </div>
                    <div className={styles.articleMeta}>
                        <div>
                            <dt className={styles.visuallyHidden}>{copy.yearLabel}</dt>
                            <dd>{study.year} · {study.status}</dd>
                        </div>
                        <div>
                            <dt className={styles.visuallyHidden}>{copy.roleLabel}</dt>
                            <dd>{study.role}</dd>
                        </div>
                        <div>
                            <dt className={styles.visuallyHidden}>{copy.typeLabel}</dt>
                            <dd>{study.facets.join(' · ')}</dd>
                        </div>
                        <div>
                            <dt className={styles.visuallyHidden}>{copy.stackLabel}</dt>
                            <dd>{study.stack.join(' · ')}</dd>
                        </div>
                    </div>
                </dl>
                <a className={styles.backLink} href={study.url} target="_blank" rel="noreferrer" style={{ marginTop: '1.25rem' }}>
                    <span>{copy.visit}</span>
                    <Icon name="arrow_outward" />
                </a>
            </section>

            <nav className={styles.otherArticles} aria-label={copy.otherProjects}>
                <p className={styles.sidebarLabel}>{copy.otherProjects}</p>
                <ul>
                    {others.map(other => (
                        <li key={other.slug}>
                            <Link href={other.href}>
                                <span>{other.year}</span>
                                <strong>{other.name}</strong>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}

export function CaseStudySidebar({ study, others, copy }: CaseStudySidebarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const localeRoot = `/${study.locale}`;
    const back = (
        <Link href={`${localeRoot}#work`} className={styles.backLink}>
            <Icon name="arrow_back" />
            <span>{copy.backToWork}</span>
        </Link>
    );

    return (
        <>
            <div className={styles.menuLayer}>
                <ColumnMenuPanel
                    open={menuOpen}
                    label={copy.menuLabel}
                    items={[
                        { href: `${localeRoot}#top`, label: copy.menuHome },
                        { href: `${localeRoot}#work`, label: copy.menuWork },
                        { href: `${localeRoot}#articles`, label: copy.menuArticles },
                        { href: `${localeRoot}#about`, label: copy.menuAbout },
                        { href: getAboutPath(study.locale), label: copy.menuMe },
                        { href: `${localeRoot}#contact`, label: copy.menuContact },
                    ]}
                    onNavigate={() => setMenuOpen(false)}
                />
            </div>

            <aside className={styles.sidebar} aria-label={copy.detailsLabel} data-menu-open={menuOpen ? 'true' : undefined}>
                <ArticleThemeToggle label={copy.themeToggle} />

                <header className={styles.sidebarHeader}>
                    <ColumnMenuToggle open={menuOpen} openLabel={copy.menuOpen} closeLabel={copy.menuClose} onToggle={() => setMenuOpen(current => !current)} />
                    <Link href={localeRoot} className={styles.brand} aria-label={copy.homeLabel}>
                        <Image src="/logotipo.svg" alt="" width={538} height={92} priority />
                    </Link>
                </header>

                <div className={styles.sidebarBody}>
                    <CaseStudyContext study={study} others={others} copy={copy} />
                </div>

                <div className={styles.sidebarFooter}>{back}</div>
            </aside>

            <div className={styles.mobileArticleIntro}>
                <CaseStudyContext study={study} others={others} copy={copy} />
                {back}
            </div>
        </>
    );
}
