import { ArticleProse } from '@/features/articles/components/ArticleProse';
import { ArticleTitleBreadcrumb } from '@/features/articles/components/ArticleTitleBreadcrumb';
import styles from '@/features/articles/components/article.module.css';
import { PortfolioScrollbar } from '@/features/portfolio/components/PortfolioScrollbar';
import type { CaseStudy, CaseStudySummary } from '../types';
import { CaseStudyEnd, CaseStudySidebar } from './CaseStudySidebar';

export type CaseStudyPageCopy = {
    skip: string;
    homeLabel: string;
    backToWork: string;
    themeToggle: string;
    scrollbar: string;
    detailsLabel: string;
    projectLabel: string;
    yearLabel: string;
    roleLabel: string;
    typeLabel: string;
    stackLabel: string;
    visit: string;
    otherProjects: string;
    sourcesLabel: string;
    footnoteBack: string;
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

export function CaseStudyPage({ study, others, copy }: { study: CaseStudy; others: CaseStudySummary[]; copy: CaseStudyPageCopy }) {
    return (
        <div className={styles.articleShell}>
            <a href="#case-study-content" className={styles.skipLink}>{copy.skip}</a>

            <div className={styles.articleScroll}>
                <PortfolioScrollbar label={copy.scrollbar} />
            </div>

            <CaseStudySidebar study={study} others={others} copy={copy} />

            <div className={styles.headerScrim} aria-hidden="true" />

            <ArticleTitleBreadcrumb title={study.name} sectionLabel={copy.menuWork} sectionHref={`/${study.locale}#work`} targetId="case-study-title" />

            <main id="case-study-content" className={styles.articleMain}>
                <article>
                    <header className={styles.articleHero}>
                        <h1 id="case-study-title">{study.title}</h1>
                        <p className={styles.articleDescription}>{study.description}</p>
                    </header>

                    <div className={styles.articleBody}>
                        <ArticleProse content={study.content} screenshots={study.images} sourcesLabel={copy.sourcesLabel} footnoteBack={copy.footnoteBack} />
                    </div>
                </article>

                <CaseStudyEnd study={study} others={others} copy={copy} />
            </main>
        </div>
    );
}
