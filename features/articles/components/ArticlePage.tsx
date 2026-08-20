import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Article } from '../types';
import { ArticleThemeToggle } from './ArticleThemeToggle';
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
                {isExternal ? <ArrowUpRight aria-hidden="true" strokeWidth={1.5} /> : null}
            </a>
        );
    },
    table: ({ children }: ComponentPropsWithoutRef<'table'>) => (
        <div className={styles.tableFrame} tabIndex={0}>
            <table>{children}</table>
        </div>
    ),
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
    backToBasezero: string;
};

export function ArticlePage({ article, copy }: { article: Article; copy: ArticlePageCopy }) {
    return (
        <div className={styles.articleShell}>
            <a href="#article-content" className={styles.skipLink}>{copy.skip}</a>

            <header className={styles.siteHeader}>
                <Link href="/es" className={styles.brand} aria-label={copy.homeLabel}>
                    <Image src="/logotipo.svg" alt="" width={538} height={92} priority />
                </Link>
                <div className={styles.headerActions}>
                    <Link href="/es#articles" className={styles.backLink}>
                        <ArrowLeft aria-hidden="true" strokeWidth={1.5} />
                        <span>{copy.backToStudio}</span>
                    </Link>
                    <ArticleThemeToggle label={copy.themeToggle} />
                </div>
            </header>

            <main id="article-content">
                <article>
                    <header className={styles.articleHero}>
                        <div className={styles.articleMeta}>
                            <span>{article.category}</span>
                            <span>{formatArticleDate(article.date)}</span>
                            <span>{copy.readingTime}</span>
                        </div>
                        <div className={styles.articleHeading}>
                            <p className={styles.articleIndex}>{copy.articleIndex}</p>
                            <h1>{article.title}</h1>
                            <p className={styles.articleDescription}>{article.description}</p>
                        </div>
                    </header>

                    <div className={styles.articleBody}>
                        <aside className={styles.byline} aria-label={copy.authorLabel}>
                            <span>{copy.writtenBy}</span>
                            <strong>{article.author}</strong>
                            <span>Basezero</span>
                        </aside>
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

            <footer className={styles.articleFooter}>
                <Link href="/es#articles">
                    <ArrowLeft aria-hidden="true" strokeWidth={1.5} />
                    <span>{copy.backToBasezero}</span>
                </Link>
                <span>© {new Date().getUTCFullYear()} Basezero</span>
            </footer>
        </div>
    );
}
