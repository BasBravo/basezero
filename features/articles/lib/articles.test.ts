import { describe, expect, it } from 'vitest';
import { getArticle, getArticleSlugs, getArticleSummaries } from './articles';

describe('article content', () => {
    it('loads the Spanish article and its derived metadata', () => {
        const [slug] = getArticleSlugs('es');
        const article = getArticle('es', slug);

        expect(article).toMatchObject({
            slug: 'minimo-no-significa-incompleto',
            locale: 'es',
            author: 'Bas Bravo',
            href: '/es/articulos/minimo-no-significa-incompleto',
        });
        expect(article?.readingMinutes).toBeGreaterThanOrEqual(1);
        expect(article?.content).toContain('## Decidir qué entra no consiste en tachar funciones');
    });

    it('estimates a reading time for every published article', () => {
        const articles = getArticleSummaries('es');

        expect(articles.length).toBeGreaterThan(0);
        for (const article of articles) {
            expect(article.readingMinutes).toBeGreaterThanOrEqual(1);
        }
    });

    it('returns no articles for a locale without content', () => {
        expect(getArticleSummaries('en')).toEqual([]);
        expect(getArticle('en', 'minimo-no-significa-incompleto')).toBeNull();
    });

    it('rejects slugs that are not part of the content directory', () => {
        expect(getArticle('es', '../messages/es')).toBeNull();
    });
});
