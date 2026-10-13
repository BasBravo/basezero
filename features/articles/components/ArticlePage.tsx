import { PortfolioScrollbar } from '@/features/portfolio/components/PortfolioScrollbar';
import type { FigureCopy } from '../figures/ArticleFigure';
import { getArticlesPath } from '../lib/paths';
import { ArticleProse } from './ArticleProse';
import type { Article, ArticleSummary } from '../types';
import { ArticleEnd, ArticleSidebar } from './ArticleSidebar';
import { ArticleTitleBreadcrumb } from './ArticleTitleBreadcrumb';
import styles from './article.module.css';

function formatArticleDate(date: string) {
    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));
}

export type ArticlePageCopy = {
    skip: string;
    homeLabel: string;
    backToStudio: string;
    backToArticles: string;
    themeToggle: string;
    readingTime: string;
    authorLabel: string;
    writtenBy: string;
    sourcesLabel: string;
    footnoteBack: string;
    scrollbar: string;
    detailsLabel: string;
    publishedLabel: string;
    readingLabel: string;
    categoryLabel: string;
    otherArticles: string;
    noOtherArticles: string;
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

export function ArticlePage({
    article,
    otherArticles,
    copy,
    figures,
}: {
    article: Article;
    otherArticles: ArticleSummary[];
    copy: ArticlePageCopy;
    figures: FigureCopy;
}) {
    const formattedDate = formatArticleDate(article.date);

    return (
        <div className={styles.articleShell}>
            <a href="#article-content" className={styles.skipLink}>{copy.skip}</a>

            <div className={styles.articleScroll}>
                <PortfolioScrollbar label={copy.scrollbar} />
            </div>

            <ArticleSidebar
                article={article}
                otherArticles={otherArticles}
                formattedDate={formattedDate}
                copy={copy}
            />

            <div className={styles.headerScrim} aria-hidden="true" />

            <ArticleTitleBreadcrumb
                title={article.title}
                sectionLabel={copy.menuArticles}
                sectionHref={getArticlesPath(article.locale)}
                targetId="article-title"
            />

            <main id="article-content" className={styles.articleMain}>
                <article>
                    <header className={styles.articleHero}>
                        <h1 id="article-title">{article.title}</h1>
                        <p className={styles.articleDescription}>{article.description}</p>
                    </header>

                    <div className={styles.articleBody}>
                        <ArticleProse content={article.content} figures={figures} sourcesLabel={copy.sourcesLabel} footnoteBack={copy.footnoteBack} />
                    </div>
                </article>

                <ArticleEnd article={article} otherArticles={otherArticles} formattedDate={formattedDate} copy={copy} />
            </main>
        </div>
    );
}
