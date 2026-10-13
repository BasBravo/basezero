import { describe, expect, it } from 'vitest';
import { getArticlesPath } from './paths';

describe('getArticlesPath', () => {
    it('points to the archive of each language', () => {
        expect(getArticlesPath('es')).toBe('/es/articulos');
        expect(getArticlesPath('en')).toBe('/en/articulos');
    });
});
