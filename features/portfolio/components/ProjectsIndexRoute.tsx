import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Icon } from '@/components/ui/icon';
import { getPortfolioProjects } from '@/content/portfolio-projects';
import { ArticlesIndexEnd, ArticlesIndexSidebar } from '@/features/articles/components/ArticlesIndexSidebar';
import { ArticleTitleBreadcrumb } from '@/features/articles/components/ArticleTitleBreadcrumb';
import type { ArticlesIndexCopy } from '@/features/articles/components/ArticlesIndexPage';
import styles from '@/features/articles/components/article.module.css';
import listStyles from '@/features/articles/components/articles-index.module.css';
import { getCaseStudySlugs } from '@/features/case-studies/lib/case-studies';
import { getCaseStudyPath } from '@/features/case-studies/lib/paths';
import { PortfolioScrollbar } from './PortfolioScrollbar';

export async function ProjectsIndexRoute({ locale }: { locale: string }) {
    setRequestLocale(locale);
    const [t, p, index] = await Promise.all([
        getTranslations({ locale, namespace: 'ArticlesIndex' }),
        getTranslations({ locale, namespace: 'Portfolio' }),
        getTranslations({ locale, namespace: 'ProjectsIndex' }),
    ]);
    const title = index('title');
    const projects = getPortfolioProjects(locale);
    const studies = new Set(getCaseStudySlugs(locale));
    const count = index('count', { count: projects.length });
    const copy: ArticlesIndexCopy = {
        skip: index('skip'),
        homeLabel: t('homeLabel'), backToStudio: t('backToStudio'), themeToggle: t('themeToggle'),
        scrollbar: p('scrollbar'), detailsLabel: title, archiveLabel: title, title,
        lead: p('work.body'), listLabel: p('work.viewAll'), read: p('openProject'), rss: t('rss'),
        menuOpen: p('menu.open'), menuClose: p('menu.close'), menuLabel: p('menu.label'),
        menuHome: p('menu.home'), menuWork: p('menu.work'), menuArticles: p('menu.articles'),
        menuAbout: p('menu.about'), menuContact: p('menu.contact'), menuMe: p('menu.me'), studio: p('menu.home'),
    };
    return (
        <div className={styles.articleShell}>
            <a href="#projects-content" className={styles.skipLink}>{copy.skip}</a>
            <div className={styles.articleScroll}><PortfolioScrollbar label={copy.scrollbar} /></div>
            <ArticlesIndexSidebar locale={locale} copy={copy} count={count} latest="" />
            <div className={styles.headerScrim} aria-hidden="true" />
            <ArticleTitleBreadcrumb title={title} sectionLabel={copy.studio} sectionHref={`/${locale}`} targetId="projects-title" />
            <main id="projects-content" className={styles.articleMain}>
                <section>
                    <header className={styles.articleHero}>
                        <h1 id="projects-title">{title}</h1>
                        <p className={styles.articleDescription}>{copy.lead}</p>
                    </header>
                    <div className={styles.articleBody}>
                        <div className={listStyles.archive} role="region" aria-label={copy.listLabel}>
                            <ul className={listStyles.list}>
                                {projects.map(project => (
                                    <li key={project.id}>
                                        <Link className={listStyles.entry} href={studies.has(project.id) ? getCaseStudyPath(locale, project.id) : project.url} aria-label={`${copy.read}: ${project.name}`}>
                                            <span className={listStyles.date}>{project.year}</span>
                                            <span className={listStyles.title}>{project.name}</span>
                                            <span className={listStyles.description}>{project.description}</span>
                                            <span className={listStyles.meta}>{project.facets.join(' · ')}</span>
                                            <Icon name="arrow_outward" className={listStyles.arrow} />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
                <ArticlesIndexEnd locale={locale} copy={copy} count={count} latest="" />
            </main>
        </div>
    );
}
