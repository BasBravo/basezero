import Image from 'next/image';
import { Icon } from '@/components/ui/icon';
import articleStyles from '@/features/articles/components/article.module.css';
import { ArticleTitleBreadcrumb } from '@/features/articles/components/ArticleTitleBreadcrumb';
import { PortfolioScrollbar } from '@/features/portfolio/components/PortfolioScrollbar';
import type { PortfolioProject } from '@/content/portfolio-projects';
import { AboutEnd, AboutSidebar } from './AboutSidebar';
import portfolioStyles from '@/features/portfolio/components/portfolio.module.css';
import styles from './about.module.css';

export type AboutSocialLink = {
    label: string;
    handle: string;
    href: string;
};

type AboutItem = { title: string; body: string };

export type AboutPageCopy = {
    skip: string;
    homeLabel: string;
    backToStudio: string;
    detailsLabel: string;
    themeToggle: string;
    scrollbar: string;
    title: string;
    lead: string;
    role: string;
    studio: string;
    portraitAlt: string;
    intro: string[];
    doTitle: string;
    doItems: AboutItem[];
    pathTitle: string;
    pathIntro: string;
    pathItems: Array<AboutItem & { period: string }>;
    howTitle: string;
    howQuote: string;
    howItems: AboutItem[];
    workTitle: string;
    workBody: string;
    workVisit: string;
    workCaseStudy: string;
    stackTitle: string;
    stackBody: string;
    stackGroups: Array<{ label: string; items: string }>;
    contactTitle: string;
    contactBody: string;
    contactAction: string;
    menuOpen: string;
    menuClose: string;
    menuLabel: string;
    menuHome: string;
    menuWork: string;
    menuArticles: string;
    menuAbout: string;
    menuContact: string;
    menuMe: string;
};

function ListItem({ children }: { children: React.ReactNode }) {
    return (
        <li>
            <div className={articleStyles.listContent}>{children}</div>
        </li>
    );
}

export function AboutPage({
    locale,
    copy,
    projects,
    socialLinks,
    email,
}: {
    locale: string;
    copy: AboutPageCopy;
    projects: PortfolioProject[];
    socialLinks: AboutSocialLink[];
    email: string;
}) {
    return (
        <div className={articleStyles.articleShell}>
            <a href="#about-content" className={articleStyles.skipLink}>{copy.skip}</a>

            <div className={articleStyles.articleScroll}>
                <PortfolioScrollbar label={copy.scrollbar} />
            </div>

            <AboutSidebar locale={locale} copy={copy} socialLinks={socialLinks} />

            <div className={articleStyles.headerScrim} aria-hidden="true" />

            <ArticleTitleBreadcrumb
                title={copy.title}
                sectionLabel={copy.studio}
                sectionHref={`/${locale}`}
                targetId="about-title"
            />

            <main id="about-content" className={articleStyles.articleMain}>
                <article>
                    <header className={`${articleStyles.articleHero} ${styles.hero}`}>
                        <div className={styles.heroText}>
                            <h1 id="about-title">{copy.title}</h1>
                            <p className={articleStyles.articleDescription}>{copy.lead}</p>
                        </div>
                        <div className={styles.heroPortrait}>
                            <Image
                                src="/about/bas-bravo.jpg"
                                alt={copy.portraitAlt}
                                fill
                                priority
                                sizes="(max-width: 800px) 0px, 21rem"
                            />
                        </div>
                    </header>

                    <div className={articleStyles.articleBody}>
                        <div className={articleStyles.prose}>
                            {copy.intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}

                            <h2>{copy.doTitle}</h2>
                            <ul>
                                {copy.doItems.map(item => (
                                    <ListItem key={item.title}>
                                        <span className={styles.itemTitle}>{item.title}</span>
                                        <span className={styles.itemBody}>{item.body}</span>
                                    </ListItem>
                                ))}
                            </ul>

                            <h2>{copy.pathTitle}</h2>
                            <p>{copy.pathIntro}</p>
                            <ol>
                                {copy.pathItems.map(item => (
                                    <ListItem key={item.title}>
                                        <span className={styles.itemPeriod}>{item.period}</span>
                                        <span className={styles.itemTitle}>{item.title}</span>
                                        <span className={styles.itemBody}>{item.body}</span>
                                    </ListItem>
                                ))}
                            </ol>

                            <h2>{copy.howTitle}</h2>
                            <blockquote><p>{copy.howQuote}</p></blockquote>
                            <ul>
                                {copy.howItems.map(item => (
                                    <ListItem key={item.title}>
                                        <span className={styles.itemTitle}>{item.title}</span>
                                        <span className={styles.itemBody}>{item.body}</span>
                                    </ListItem>
                                ))}
                            </ul>

                            <h2>{copy.workTitle}</h2>
                            <p>{copy.workBody}</p>
                            <ul>
                                {projects.map(project => (
                                    <ListItem key={project.id}>
                                        <a
                                            className={styles.projectLink}
                                            href={project.caseStudyHref ?? project.url}
                                            {...(project.caseStudyHref ? {} : { target: '_blank', rel: 'noreferrer' })}
                                            aria-label={`${project.caseStudyHref ? copy.workCaseStudy : copy.workVisit}: ${project.name}`}
                                        >
                                            <span className={styles.projectName}>{project.name}</span>
                                            <span className={styles.projectDescription}>{project.description}</span>
                                            <span className={styles.projectMeta}>
                                                {project.facets.join(' · ')} · {project.year}
                                            </span>
                                            <Icon name="arrow_outward" />
                                        </a>
                                    </ListItem>
                                ))}
                            </ul>

                            <h2>{copy.stackTitle}</h2>
                            <p>{copy.stackBody}</p>
                            <ul>
                                {copy.stackGroups.map(group => (
                                    <ListItem key={group.label}>
                                        <span className={styles.itemPeriod}>{group.label}</span>
                                        <span className={styles.itemBody}>{group.items}</span>
                                    </ListItem>
                                ))}
                            </ul>

                            <h2>{copy.contactTitle}</h2>
                            <p>{copy.contactBody}</p>
                        </div>
                        <a
                            className={`${portfolioStyles.farewellActions} ${portfolioStyles.projectDialogVisit}`}
                            href={`mailto:${email}`}
                            data-visible="true"
                        >
                            <span className={`${portfolioStyles.farewellAction} ${portfolioStyles.farewellContact}`}>
                                {copy.contactAction}
                            </span>
                            <span
                                className={`${portfolioStyles.farewellAction} ${portfolioStyles.farewellCopy}`}
                                aria-hidden="true"
                            >
                                <Icon name="arrow_outward" />
                            </span>
                        </a>
                    </div>
                </article>

                <AboutEnd locale={locale} copy={copy} socialLinks={socialLinks} />
            </main>
        </div>
    );
}
