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

function AboutContext({
    copy,
    socialLinks,
    showPortrait = false,
}: Omit<AboutSidebarProps, 'locale'> & { showPortrait?: boolean }) {
    return (
        <>
            <section className={articleStyles.articleDetails}>
                {showPortrait ? (
                    <span className={styles.portrait}>
                        <Image
                            src="/about/bas-bravo.jpg"
                            alt={copy.portraitAlt}
                            width={288}
                            height={288}
                            sizes="6rem"
                        />
                    </span>
                ) : null}
                <p className={articleStyles.mobileArticleTitle} aria-hidden="true">{copy.title}</p>
                <p className={articleStyles.sidebarDescription}>{copy.lead}</p>
                <dl className={articleStyles.articleFacts}>
                    <div className={articleStyles.articleByline}>
                        <dd>{copy.role}</dd>
                    </div>
                </dl>
            </section>

            <ul className={styles.sidebarLinks}>
                {socialLinks.map(link => (
                    <li key={link.href}>
                        <a href={link.href} target="_blank" rel="noreferrer me">
                            {link.label}
                            <span>{link.handle}</span>
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
                    <AboutContext copy={copy} socialLinks={socialLinks} />
                </div>

                <div className={articleStyles.sidebarFooter}>
                    <BackLink href={localeRoot} label={copy.backToStudio} />
                </div>
            </aside>

            <div className={articleStyles.mobileArticleIntro}>
                <AboutContext copy={copy} socialLinks={socialLinks} showPortrait />
                <BackLink href={localeRoot} label={copy.backToStudio} />
            </div>
        </>
    );
}
