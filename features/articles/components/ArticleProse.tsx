import Image from 'next/image';
import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown, { defaultUrlTransform, type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArticleFigure, figureIdOf, type FigureCopy } from '../figures/ArticleFigure';
import styles from './article.module.css';

type ImageSizes = Record<string, { width: number; height: number }>;

function markdownComponentsOf(figures?: FigureCopy, screenshots?: ImageSizes): Components {
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
            if (figure) return figures ? <ArticleFigure id={figure} copy={figures} /> : null;

            // Interface screenshots are shown whole and in colour, at their real proportions; tall phone shots stay narrow.
            const shot = screenshots?.[src];
            if (shot) {
                return (
                    <span className={styles.proseImage} data-shot={shot.height > shot.width ? 'phone' : 'screen'}>
                        <span className={styles.proseShotFrame}>
                            <Image src={src} alt={alt} width={shot.width} height={shot.height} sizes="(max-width: 800px) 100vw, 70vw" />
                        </span>
                        {title ? <span className={styles.proseImageCaption}>{title}</span> : null}
                    </span>
                );
            }

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

/** Markdown body of an article or a case study: images with captions, footnotes as sources, and interactive figures when given their copy. */
export function ArticleProse({ content, figures, screenshots, sourcesLabel, footnoteBack }: { content: string; figures?: FigureCopy; screenshots?: ImageSizes; sourcesLabel: string; footnoteBack: string }) {
    return (
        <div className={styles.prose}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                remarkRehypeOptions={{
                    footnoteLabel: sourcesLabel,
                    footnoteBackLabel: footnoteBack,
                    footnoteLabelProperties: {},
                }}
                components={markdownComponentsOf(figures, screenshots)}
                urlTransform={url => (figureIdOf(url) ? url : defaultUrlTransform(url))}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
