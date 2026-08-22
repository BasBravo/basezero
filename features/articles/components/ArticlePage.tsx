import Image from 'next/image';
import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icon } from '@/components/ui/icon';
import { PortfolioScrollbar } from '@/features/portfolio/components/PortfolioScrollbar';
import type { Article, ArticleSummary } from '../types';
import { ArticleSidebar } from './ArticleSidebar';
import { ArticleTitleBreadcrumb } from './ArticleTitleBreadcrumb';
import styles from './article.module.css';

const markdownComponents: Components = {
    a: ({ href = '', children, node, ...props }) => {
        void node;
        const isExternal = href.startsWith('http://') || href.startsWith('https://');
        return (
            <a
                href={href}
                {...props}
                {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
                {children}
                {isExternal ? <Icon name="arrow_outward" /> : null}
            </a>
        );
    },
    table: ({ children }: ComponentPropsWithoutRef<'table'>) => (
        <div className={styles.tableFrame} tabIndex={0}>
            <table>{children}</table>
        </div>
    ),
    img: ({ src, alt = '', title, node }) => {
        void node;
        if (typeof src !== 'string') return null;

        return (
            <span className={styles.proseImage}>
                <span className={styles.proseImageFrame}>
                    <Image src={src} alt={alt} fill sizes="(max-width: 800px) 100vw, 70vw" />
                </span>
                {title ? <span className={styles.proseImageCaption}>{title}</span> : null}
            </span>
        );
    },
};

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
    themeToggle: string;
    articleIndex: string;
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
};

export function ArticlePage({
    article,
    otherArticles,
    copy,
}: {
    article: Article;
    otherArticles: ArticleSummary[];
    copy: ArticlePageCopy;
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

            <ArticleTitleBreadcrumb
                title={article.title}
                sectionLabel={copy.menuArticles}
                sectionHref={`/${article.locale}#articles`}
                targetId="article-title"
            />

            <main id="article-content" className={styles.articleMain}>
                <article>
                    <header className={styles.articleHero}>
                        <p className={styles.articleIndex}>{copy.articleIndex}</p>
                        <h1 id="article-title">{article.title}</h1>
                        <p className={styles.articleDescription}>{article.description}</p>
                    </header>

                    <div className={styles.articleBody}>
                        <div className={styles.prose}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                remarkRehypeOptions={{
                                    footnoteLabel: copy.sourcesLabel,
                                    footnoteBackLabel: copy.footnoteBack,
                                }}
                                components={markdownComponents}
                            >
                                {article.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </article>

            </main>
        </div>
    );
}
