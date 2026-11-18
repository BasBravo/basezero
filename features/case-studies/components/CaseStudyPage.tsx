import { Icon } from '@/components/ui/icon';
import { projectMarks } from '@/content/project-marks';
import { ArticleProse } from '@/features/articles/components/ArticleProse';
import { ArticleTitleBreadcrumb } from '@/features/articles/components/ArticleTitleBreadcrumb';
import Image from 'next/image';
import styles from '@/features/articles/components/article.module.css';
import { PortfolioScrollbar } from '@/features/portfolio/components/PortfolioScrollbar';
import type { CaseStudy, CaseStudySummary } from '../types';
import { CaseStudyEnd, CaseStudySidebar } from './CaseStudySidebar';
import { CaseStudyCarousel, type CarouselCopy } from './CaseStudyCarousel';

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

export function CaseStudyPage({ study, others, copy, carouselCopy }: { study: CaseStudy; others: CaseStudySummary[]; copy: CaseStudyPageCopy; carouselCopy: CarouselCopy }) {
    const carouselImages = new Set(study.carousels.flatMap(carousel => carousel.slides.map(slide => slide.src)));
    const content = study.content.replace(/^!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)[ \t]*$/gm, (match, src: string) => carouselImages.has(src) ? '' : match);
    const parts = content.split(/<!-- carousel:([\w-]+) -->/g);
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
                        {projectMarks[study.slug] ? <Image className={styles.caseStudyMark} src={projectMarks[study.slug]} alt="" width={96} height={96} priority /> : null}
                        <h1 id="case-study-title">{study.title}</h1>
                        <p className={styles.articleDescription}>{study.description}</p>
                    </header>

                    {study.url ? (
                        <div className={styles.caseVisit}>
                            <a href={study.url} target="_blank" rel="noreferrer">{copy.visit}<Icon name="arrow_outward" /></a>
                        </div>
                    ) : null}

                    {parts.map((part, index) => {
                        if (index % 2 === 1) {
                            const carousel = study.carousels.find(item => item.id === part);
                            return carousel ? <CaseStudyCarousel key={`carousel-${part}`} carousel={carousel} copy={carouselCopy} frame={study.carouselFrame} /> : null;
                        }
                        return part.trim() ? (
                            <div className={styles.caseBody} key={`body-${index}`}>
                                <ArticleProse content={part} screenshots={study.images} sourcesLabel={copy.sourcesLabel} footnoteBack={copy.footnoteBack} />
                            </div>
                        ) : null;
                    })}
                </article>

                <CaseStudyEnd study={study} others={others} copy={copy} />
            </main>
        </div>
    );
}
