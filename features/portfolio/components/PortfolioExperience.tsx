'use client';

import { ArrowUpRight, Moon, Plus, Sun } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
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
    languageSwitch: string;
    menuOpen: string;
    menuClose: string;
    menuLabel: string;
    menuHome: string;
    menuWork: string;
    menuAbout: string;
    menuContact: string;
    scrollbar: string;
    aboutTitle: string;
    aboutParagraphs: string[];
    servicesLabel: string;
    servicesTitle: string;
    servicesBody: string;
    services: Array<{
        number: string;
        title: string;
        body: string;
    }>;
    farewellTitle: string;
    farewellBody: string;
    farewellEmailLabel: string;
    projectDialogClose: string;
    projectDialogChallenge: string;
    projectDialogSolution: string;
    projectDialogContribution: string;
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
};

export function PortfolioExperience({ copy, projects }: PortfolioExperienceProps) {
    const [activeProject, setActiveProject] = useState(-1);
    const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const alternateLocale = copy.locale === 'es' ? 'en' : 'es';

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

    return (
        <div className={styles.siteShell} data-menu-open={menuOpen ? 'true' : undefined}>
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
                        <a
                            className={styles.languageSwitch}
                            href={`/${alternateLocale}`}
                            hrefLang={alternateLocale}
                            lang={alternateLocale}
                            aria-label={copy.languageSwitch}
                            onClick={() => {
                                document.cookie = `NEXT_LOCALE=${alternateLocale}; Max-Age=31536000; Path=/; SameSite=Lax`;
                            }}
                        >
                            {alternateLocale.toUpperCase()}
                        </a>
                        <button
                            className={styles.themeToggle}
                            type="button"
                            onClick={toggleTheme}
                            aria-label={copy.themeToggle}
                        >
                            <Sun className={styles.themeIconLight} aria-hidden="true" strokeWidth={1.5} />
                            <Moon className={styles.themeIconDark} aria-hidden="true" strokeWidth={1.5} />
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
                    <div id="top" className={styles.stickyStage} />
                </section>

                <section id="work" className={styles.workSection}>
                    <header className={styles.workIntro}>
                        <FadeInTitle className={styles.projectsTitle}>{copy.workTitle}</FadeInTitle>
                        <p className={styles.projectsBody}>{copy.workBody}</p>
                    </header>
                    <ol id="projects" className={styles.projectList} aria-label={copy.navWork}>
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
                                    <span className={styles.projectNumber} aria-hidden="true">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className={styles.projectName}>{project.name}</span>
                                    <span className={styles.projectDescription}>{project.description}</span>
                                    <span className={styles.projectMeta}>{project.discipline} · {project.year}</span>
                                    <Plus className={styles.projectArrow} aria-hidden="true" strokeWidth={1.5} />
                                </button>
                            </li>
                        ))}
                    </ol>

                    <ServicesFit
                        label={copy.servicesLabel}
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
                        <a className={styles.farewellAction} href="mailto:hello@basezero.dev">
                            <span>{copy.contactAction}</span>
                            <ArrowUpRight aria-hidden="true" strokeWidth={1.5} />
                        </a>
                        <p className={styles.farewellEmail}>
                            {copy.farewellEmailLabel}{' '}
                            <a href="mailto:hello@basezero.dev">hello@basezero.dev</a>
                        </p>
                    </section>
                </section>
            </main>

            {selectedProject ? (
                <ProjectDialog
                    project={selectedProject}
                    copy={{
                        close: copy.projectDialogClose,
                        challenge: copy.projectDialogChallenge,
                        solution: copy.projectDialogSolution,
                        contribution: copy.projectDialogContribution,
                        visit: copy.projectDialogVisit,
                    }}
                    onClose={() => setSelectedProject(null)}
                />
            ) : null}
        </div>
    );
}
