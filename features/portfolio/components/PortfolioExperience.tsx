'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import type { ArticleSummary } from '@/features/articles/types';
import type { PortfolioProject } from '@/content/portfolio-projects';
import { BotanicalField } from './BotanicalField';
import { ColumnMenuPanel, ColumnMenuToggle } from './ColumnMenu';
import { FadeInTitle } from './FadeInTitle';
import { GrowthNarrative } from './GrowthNarrative';
import { PortfolioScrollbar } from './PortfolioScrollbar';
import { ProjectDialog } from './ProjectDialog';
import { TerminalAbout } from './TerminalAbout';
import styles from './portfolio.module.css';

export type PortfolioCopy = {
    locale: string;
    navWork: string;
    workTitle: string;
    workBody: string;
    introTitle: string;
    introBody: string;
    introViewWork: string;
    openProject: string;
    contactAction: string;
    themeToggle: string;
    menuOpen: string;
    menuClose: string;
    menuLabel: string;
    menuHome: string;
    menuWork: string;
    menuAbout: string;
    menuArticles: string;
    menuContact: string;
    scrollbar: string;
    aboutTitle: string;
    aboutParagraphs: string[];
    articlesTitle: string;
    articlesBody: string;
    readArticle: string;
    farewellTitle: string;
    farewellBody: string;
    copyEmail: string;
    emailCopied: string;
    projectDialogClose: string;
    projectDialogVisit: string;
    processLabel: string;
    processSteps: Array<{
        number: string;
        title: string;
        body: string;
    }>;
};

const CONTACT_EMAIL = 'hello@basezero.dev';

type PortfolioExperienceProps = {
    copy: PortfolioCopy;
    projects: PortfolioProject[];
    articles: ArticleSummary[];
};

function formatArticleDate(date: string, locale: string) {
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));
}

export function PortfolioExperience({ copy, projects, articles }: PortfolioExperienceProps) {
    const [activeProject, setActiveProject] = useState(-1);
    const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [emailCopied, setEmailCopied] = useState(false);

    function toggleTheme() {
        const currentTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = nextTheme;
        document.documentElement.style.colorScheme = nextTheme;
        try {
            window.localStorage.setItem('basezero-theme', nextTheme);
        } catch {
            // The visual preference still applies for the current session.
        }
    }

    async function copyEmailAddress() {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        setEmailCopied(true);
        window.setTimeout(() => setEmailCopied(false), 1800);
    }

    function openMailComposer() {
        window.location.href = `mailto:${CONTACT_EMAIL}`;
    }

    return (
        <div id="top" className={styles.siteShell} data-menu-open={menuOpen ? 'true' : undefined}>
            <a href="#content" className={styles.skipLink}>
                {copy.locale === 'es' ? 'Saltar al contenido' : 'Skip to content'}
            </a>

            <PortfolioScrollbar label={copy.scrollbar} />

            <button
                className={styles.themeToggle}
                type="button"
                onClick={toggleTheme}
                aria-label={copy.themeToggle}
            >
                <Icon name="light_mode" className={styles.themeIconLight} />
                <Icon name="dark_mode" className={styles.themeIconDark} />
            </button>

            <aside className={styles.sidebar} aria-label="Basezero">
                <header className={styles.sidebarHeader}>
                    <ColumnMenuToggle
                        open={menuOpen}
                        openLabel={copy.menuOpen}
                        closeLabel={copy.menuClose}
                        onToggle={() => setMenuOpen((current) => !current)}
                    />
                    <a
                        href={`/${copy.locale}#top`}
                        className={styles.brand}
                        aria-label={menuOpen ? copy.menuClose : copy.menuOpen}
                        aria-expanded={menuOpen}
                        aria-controls="column-menu"
                        onClick={(event) => {
                            event.preventDefault();
                            setMenuOpen((current) => !current);
                        }}
                    >
                        <Image
                            className={styles.brandFull}
                            src="/logotipo.svg"
                            alt=""
                            width={538}
                            height={92}
                            priority
                        />
                    </a>
                </header>
                <div className={styles.sidebarTop}>
                    <ColumnMenuPanel
                        open={menuOpen}
                        label={copy.menuLabel}
                        items={[
                            { href: '#top', label: copy.menuHome },
                            { href: '#work', label: copy.menuWork },
                            ...(articles.length > 0 ? [{ href: '#articles', label: copy.menuArticles }] : []),
                            { href: '#about', label: copy.menuAbout },
                            { href: '#contact', label: copy.menuContact },
                        ]}
                        onNavigate={() => setMenuOpen(false)}
                    />
                </div>
                <div className={styles.sidebarBottom}>
                    <a
                        className={styles.socialLink}
                        href="https://x.com/basbravo_"
                        target="_blank"
                        rel="noreferrer"
                    >
                        @basbravo
                    </a>
                    <a className={styles.contactAction} href={`mailto:${CONTACT_EMAIL}`}>
                        <span>{copy.contactAction}</span>
                        <Icon name="arrow_outward" />
                    </a>
                </div>
            </aside>

            <div className={styles.headerScrim} aria-hidden="true" />
            <div className={styles.footerScrim} aria-hidden="true" />

            <main id="content" className={styles.contentColumn}>
                <section id="growth" className={styles.growthSection}>
                    <GrowthNarrative
                        introTitle={copy.introTitle}
                        introBody={copy.introBody}
                        introViewWork={copy.introViewWork}
                        processLabel={copy.processLabel}
                        processSteps={copy.processSteps}
                    />
                    <BotanicalField activeProject={activeProject} />
                    <div className={styles.stickyStage} />
                </section>

                <section id="work" className={styles.workSection}>
                    <header className={styles.workIntro}>
                        <FadeInTitle className={styles.projectsTitle}>{copy.workTitle}</FadeInTitle>
                        <p className={styles.projectsBody}>{copy.workBody}</p>
                    </header>
                    <ul id="projects" className={styles.projectList} aria-label={copy.navWork}>
                        {projects.map((project, index) => (
                            <li key={project.id}>
                                <button
                                    type="button"
                                    className={styles.project}
                                    aria-label={`${copy.openProject}: ${project.name}`}
                                    aria-haspopup="dialog"
                                    onClick={() => setSelectedProject(project)}
                                    onPointerEnter={() => setActiveProject(index)}
                                    onPointerLeave={() => setActiveProject(-1)}
                                    onFocus={() => setActiveProject(index)}
                                    onBlur={() => setActiveProject(-1)}
                                >
                                    <span className={styles.projectName}>{project.name}</span>
                                    <span className={styles.projectDescription}>{project.description}</span>
                                    <span className={styles.projectMeta}>
                                        {project.facets.join(' · ')} · {project.year}
                                    </span>
                                    <Icon name="add" className={styles.projectArrow} />
                                </button>
                            </li>
                        ))}
                    </ul>

                    {articles.length > 0 ? (
                        <section id="articles" className={styles.articlesSection}>
                            <header className={styles.articlesIntro}>
                                <FadeInTitle className={styles.articlesTitle}>{copy.articlesTitle}</FadeInTitle>
                                <p className={styles.articlesBody}>{copy.articlesBody}</p>
                            </header>
                            <ul className={styles.projectList} aria-label={copy.menuArticles}>
                                {articles.map((article) => (
                                    <li key={article.slug}>
                                        <Link
                                            className={styles.project}
                                            href={article.href}
                                            aria-label={`${copy.readArticle}: ${article.title}`}
                                        >
                                            <span className={styles.projectName}>{article.title}</span>
                                            <span className={styles.projectMeta}>
                                                {article.category} · {formatArticleDate(article.date, copy.locale)}
                                            </span>
                                            <Icon name="arrow_outward" className={styles.articleArrow} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ) : null}

                    <TerminalAbout
                        title={copy.aboutTitle}
                        paragraphs={copy.aboutParagraphs}
                    />

                    <section id="contact" className={styles.farewellSection}>
                        <FadeInTitle className={styles.farewellTitle}>{copy.farewellTitle}</FadeInTitle>
                        <p className={styles.farewellBody}>{copy.farewellBody}</p>
                        <div className={styles.farewellActions} role="group">
                            <button
                                className={`${styles.farewellAction} ${styles.farewellContact}`}
                                type="button"
                                onClick={openMailComposer}
                            >
                                {copy.contactAction}
                            </button>
                            <button
                                className={`${styles.farewellAction} ${styles.farewellCopy}`}
                                type="button"
                                aria-label={emailCopied ? copy.emailCopied : copy.copyEmail}
                                aria-live="polite"
                                onClick={() => void copyEmailAddress()}
                            >
                                {emailCopied
                                    ? <Icon name="check" />
                                    : <Icon name="content_copy" />}
                            </button>
                        </div>
                    </section>
                </section>
            </main>

            {selectedProject ? (
                <ProjectDialog
                    project={selectedProject}
                    copy={{
                        close: copy.projectDialogClose,
                        visit: copy.projectDialogVisit,
                    }}
                    onClose={() => setSelectedProject(null)}
                />
            ) : null}
        </div>
    );
}
