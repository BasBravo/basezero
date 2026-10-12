import { describe, expect, it } from 'vitest';
import { getArticle, getArticleSummaries } from '@/features/articles/lib/articles';
import { articleMarkdown, llmsFullTxt, llmsTxt, rssFeed } from './agents';
import { articleGraph } from './structured-data';
import { articleMarkdownPath, ids, siteUrl } from './site';

const summaries = getArticleSummaries('es');
const article = getArticle('es', 'lanzar-no-es-el-final-de-la-prueba')!;

describe('files for AI agents', () => {
    it('lists every Spanish article in llms.txt with its Markdown copy, plus contact and services', () => {
        const text = llmsTxt();
        expect(text.startsWith('# Basezero\n\n> ')).toBe(true);
        for (const summary of summaries) expect(text).toContain(`${siteUrl}${articleMarkdownPath('es', summary.slug)}`);
        expect(text).toContain('hello@basezero.dev');
        expect(text).toContain('## Servicios');
        expect(text).toContain(`${siteUrl}/llms-full.txt`);
    });

    it('turns an article into plain Markdown: figures described, links absolute, facts on top', () => {
        const markdown = articleMarkdown(article);
        expect(markdown.startsWith(`# ${article.title}\n\n> ${article.description}`)).toBe(true);
        expect(markdown).not.toContain('figure:');
        expect(markdown).toContain('*Figura interactiva: ');
        expect(markdown).toContain(`](${siteUrl}/es/articulos/construir-ya-no-es-el-cuello-de-botella)`);
        expect(markdown).not.toMatch(/\]\(\/es\//);
        expect(markdown).toContain('[^1]:');
    });

    it('puts every article in full in llms-full.txt, newest first', () => {
        const full = llmsFullTxt();
        const positions = summaries.map(summary => full.indexOf(`# ${summary.title}\n`));
        expect(positions.every(position => position > 0)).toBe(true);
        expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    });

    it('writes a valid-looking RSS feed with one item per article', () => {
        const feed = rssFeed();
        expect(feed.match(/<item>/g)).toHaveLength(summaries.length);
        expect(feed).toContain('<language>es-ES</language>');
        expect(feed).not.toMatch(/&(?!amp;|lt;|gt;|quot;)/);
    });
});

describe('article structured data', () => {
    it('describes the article as a BlogPosting by the site’s person, with a breadcrumb', () => {
        const graph = articleGraph(article)['@graph'] as Record<string, unknown>[];
        const post = graph.find(node => node['@type'] === 'BlogPosting')!;
        expect(post.headline).toBe(article.title);
        expect(post.datePublished).toBe(article.date);
        expect((post.author as { '@id': string })['@id']).toBe(ids.person);
        expect(post.wordCount).toBeGreaterThan(500);
        expect(graph.some(node => node['@type'] === 'BreadcrumbList')).toBe(true);
    });
});
