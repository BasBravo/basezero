'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { getAboutPath } from '../lib/paths';
import { ArticleThemeToggle } from '@/features/articles/components/ArticleThemeToggle';
import articleStyles from '@/features/articles/components/article.module.css';
import { ColumnMenuPanel, ColumnMenuToggle } from '@/features/portfolio/components/ColumnMenu';
import type { AboutPageCopy, AboutSocialLink } from './AboutPage';
import styles from './about.module.css';

type AboutSidebarProps = {
    locale: string;
    copy: AboutPageCopy;
    socialLinks: AboutSocialLink[];
};

/** The role and the social links: the sidebar on desktop, the end of the page on mobile. */
function AboutDetails({ copy, socialLinks }: Omit<AboutSidebarProps, 'locale'>) {
    return (
        <>
            <section className={articleStyles.articleDetails}>
                <dl className={articleStyles.articleFacts}>
                    <div className={articleStyles.articleByline}>
                        <dd>{copy.role}</dd>
                    </div>
                </dl>
            </section>

            <ul className={styles.sidebarLinks}>
                {socialLinks.map(link => (
                    <li key={link.href}>
                        <a href={link.href} target="_blank" rel="noreferrer me" aria-label={`${link.label}: ${link.handle}`}>
                            {link.label}
                            <Icon name="arrow_outward" />
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
}

function BackLink({ href, label }: { href: string; label: string }) {
    return (
        <Link href={href} className={articleStyles.backLink}>
            <Icon name="arrow_back" />
            <span>{label}</span>
        </Link>
    );
}

/** Mobile only: the role, the social links and the way back, after the last section. */
export function AboutEnd({ locale, copy, socialLinks }: AboutSidebarProps) {
    return (
        <footer className={articleStyles.mobileArticleEnd}>
            <AboutDetails copy={copy} socialLinks={socialLinks} />
            <BackLink href={`/${locale}`} label={copy.backToStudio} />
        </footer>
    );
}

export function AboutSidebar({ locale, copy, socialLinks }: AboutSidebarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const localeRoot = `/${locale}`;

    return (
        <>
            <div className={articleStyles.menuLayer}>
                <ColumnMenuPanel
                    open={menuOpen}
                    label={copy.menuLabel}
                    items={[
                        { href: `${localeRoot}#top`, label: copy.menuHome },
                        { href: `${localeRoot}#work`, label: copy.menuWork },
                        { href: `${localeRoot}#articles`, label: copy.menuArticles },
                        { href: `${localeRoot}#about`, label: copy.menuAbout },
                        { href: getAboutPath(locale === 'es' ? 'es' : 'en'), label: copy.menuMe },
                        { href: `${localeRoot}#contact`, label: copy.menuContact },
                    ]}
                    onNavigate={() => setMenuOpen(false)}
                />
            </div>

            <aside
                className={articleStyles.sidebar}
                aria-label={copy.detailsLabel}
                data-menu-open={menuOpen ? 'true' : undefined}
            >
                <ArticleThemeToggle label={copy.themeToggle} />

                <header className={articleStyles.sidebarHeader}>
                    <ColumnMenuToggle
                        open={menuOpen}
                        openLabel={copy.menuOpen}
                        closeLabel={copy.menuClose}
                        onToggle={() => setMenuOpen(current => !current)}
                    />
                    <Link href={localeRoot} className={articleStyles.brand} aria-label={copy.homeLabel}>
                        <Image src="/logotipo.svg" alt="" width={538} height={92} priority />
                    </Link>
                </header>

                <div className={articleStyles.sidebarBody}>
                    <AboutDetails copy={copy} socialLinks={socialLinks} />
                </div>

                <div className={articleStyles.sidebarFooter}>
                    <BackLink href={localeRoot} label={copy.backToStudio} />
                </div>
            </aside>

            <div className={articleStyles.mobileArticleIntro}>
                <section className={articleStyles.articleDetails}>
                    <span className={styles.portrait}>
                        <Image
                            src="/about/bas-bravo.jpg"
                            alt={copy.portraitAlt}
                            width={336}
                            height={336}
                            sizes="7rem"
                        />
                    </span>
                    <p className={articleStyles.mobileArticleTitle} aria-hidden="true">{copy.title}</p>
                    <p className={articleStyles.sidebarDescription}>{copy.lead}</p>
                </section>
            </div>
        </>
    );
}
