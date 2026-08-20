'use client';

import { ArrowUpRight, Check, Copy, Moon, Plus, Sun } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { ArticleSummary } from '@/features/articles/types';
import type { PortfolioProject } from '@/content/portfolio-projects';
import { BotanicalField } from './BotanicalField';
import { ColumnMenuPanel, ColumnMenuToggle } from './ColumnMenu';
import { FadeInTitle } from './FadeInTitle';
import { GrowthNarrative } from './GrowthNarrative';
import { PortfolioScrollbar } from './PortfolioScrollbar';
import { ProjectDialog } from './ProjectDialog';
import { ServicesFit } from './ServicesFit';
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
    servicesTitle: string;
    servicesBody: string;
    services: Array<{
        number: string;
        title: string;
        body: string;
    }>;
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
        await navigator.clipboard.writeText('hello@basezero.dev');
        setEmailCopied(true);
        window.setTimeout(() => setEmailCopied(false), 1800);
    }

    return (
        <div id="top" className={styles.siteShell} data-menu-open={menuOpen ? 'true' : undefined}>
            <a href="#content" className={styles.skipLink}>
                {copy.locale === 'es' ? 'Saltar al contenido' : 'Skip to content'}
            </a>

            <PortfolioScrollbar label={copy.scrollbar} />

            <aside className={styles.sidebar} aria-label="Basezero">
                <header className={styles.sidebarHeader}>
                    <a href={`/${copy.locale}#top`} className={styles.brand} aria-label="Basezero — Home">
                        <Image
                            className={styles.brandFull}
                            src="/logotipo.svg"
                            alt=""
                            width={538}
                            height={92}
                            priority
                        />
                    </a>
                    <div className={styles.sidebarActions}>
                        <button
                            className={styles.themeToggle}
                            type="button"
                            onClick={toggleTheme}
                            aria-label={copy.themeToggle}
                        >
                            <Sun className={styles.themeIconLight} aria-hidden="true" strokeWidth={2.25} />
                            <Moon className={styles.themeIconDark} aria-hidden="true" strokeWidth={2.25} />
                        </button>
                        <ColumnMenuToggle
                            open={menuOpen}
                            openLabel={copy.menuOpen}
                            closeLabel={copy.menuClose}
                            onToggle={() => setMenuOpen((current) => !current)}
                        />
                    </div>
                </header>
                <div className={styles.sidebarTop}>
                    <ColumnMenuPanel
                        open={menuOpen}
                        label={copy.menuLabel}
                        items={[
                            { href: '#top', label: copy.menuHome },
                            { href: '#projects', label: copy.menuWork },
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
                    <a className={styles.contactAction} href="mailto:hello@basezero.dev">
                        <span>{copy.contactAction}</span>
                        <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
                    </a>
                </div>
            </aside>

            <div className={styles.headerScrim} aria-hidden="true">
                <span className={styles.headerScrimLayer} />
                <span className={styles.headerScrimLayer} />
                <span className={styles.headerScrimLayer} />
                <span className={styles.headerScrimLayer} />
                <span className={styles.headerScrimLayer} />
                <span className={styles.headerScrimLayer} />
                <span className={styles.headerScrimLayer} />
                <span className={styles.headerScrimTint} />
            </div>

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
                                    <Plus className={styles.projectArrow} aria-hidden="true" strokeWidth={1.5} />
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
                                            <ArrowUpRight className={styles.articleArrow} aria-hidden="true" strokeWidth={1.5} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ) : null}

                    <ServicesFit
                        title={copy.servicesTitle}
                        body={copy.servicesBody}
                        services={copy.services}
                    />

                    <TerminalAbout
                        title={copy.aboutTitle}
                        paragraphs={copy.aboutParagraphs}
                    />

                    <section id="contact" className={styles.farewellSection}>
                        <FadeInTitle className={styles.farewellTitle}>{copy.farewellTitle}</FadeInTitle>
                        <p className={styles.farewellBody}>{copy.farewellBody}</p>
                        <div className={styles.farewellActions}>
                            <a className={styles.farewellAction} href="mailto:hello@basezero.dev">
                                <span>{copy.contactAction}</span>
                                <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
                            </a>
                            <button
                                className={styles.copyEmailAction}
                                type="button"
                                aria-label={emailCopied ? copy.emailCopied : copy.copyEmail}
                                title={emailCopied ? copy.emailCopied : copy.copyEmail}
                                onClick={() => void copyEmailAddress()}
                            >
                                {emailCopied
                                    ? <Check aria-hidden="true" strokeWidth={1.5} />
                                    : <Copy aria-hidden="true" strokeWidth={1.5} />}
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
