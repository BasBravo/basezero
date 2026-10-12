import Image from 'next/image';
import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown, { defaultUrlTransform, type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PortfolioScrollbar } from '@/features/portfolio/components/PortfolioScrollbar';
import { ArticleFigure, figureIdOf, type FigureCopy } from '../figures/ArticleFigure';
import type { Article, ArticleSummary } from '../types';
import { ArticleSidebar } from './ArticleSidebar';
import { ArticleTitleBreadcrumb } from './ArticleTitleBreadcrumb';
import styles from './article.module.css';

function markdownComponentsOf(figures: FigureCopy): Components {
    return {
        a: ({ href = '', children, node, className, ...props }) => {
            void node;
            const isBackref = className?.includes('footnote-backref') === true
                || href.includes('fnref');
            if (isBackref) return null;

            const isExternal = href.startsWith('http://') || href.startsWith('https://');
            return (
                <a
                    href={href}
                    className={className}
                    {...props}
                    {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                    {children}
                </a>
            );
        },
        hr: () => null,
        li: ({ children, node, ...props }) => {
            void node;
            return (
                <li {...props}>
                    <div className={styles.listContent}>{children}</div>
                </li>
            );
        },
        section: ({ className, children, node, ...props }) => {
            void node;
            const isFootnotes = className?.includes('footnotes') === true;
            return (
                <section
                    className={isFootnotes ? styles.footnotes : className}
                    {...props}
                >
                    {children}
                </section>
            );
        },
        table: ({ children }: ComponentPropsWithoutRef<'table'>) => (
            <div className={styles.tableFrame} tabIndex={0}>
                <table>{children}</table>
            </div>
        ),
        p: ({ children, node, ...props }) => {
            const [first] = node?.children ?? [];
            const src = first?.type === 'element' && first.tagName === 'img' ? first.properties?.src : null;
            if (typeof src === 'string' && figureIdOf(src)) return <div className={styles.proseFigure}>{children}</div>;
            return <p {...props}>{children}</p>;
        },
        img: ({ src, alt = '', title, node }) => {
            void node;
            if (typeof src !== 'string') return null;
            const figure = figureIdOf(src);
            if (figure) return <ArticleFigure id={figure} copy={figures} />;

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
}

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
                sectionHref={`/${article.locale}#articles`}
                targetId="article-title"
            />

            <main id="article-content" className={styles.articleMain}>
                <article>
                    <header className={styles.articleHero}>
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
                                    footnoteLabelProperties: {},
                                }}
                                components={markdownComponentsOf(figures)}
                                urlTransform={url => (figureIdOf(url) ? url : defaultUrlTransform(url))}
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
