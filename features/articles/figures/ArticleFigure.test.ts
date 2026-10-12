import { describe, expect, it } from 'vitest';
import { figureIdOf } from './ArticleFigure';

describe('article figures', () => {
    it('recognises the figures an article can embed', () => {
        expect(figureIdOf('figure:sorter')).toBe('sorter');
        expect(figureIdOf('figure:beam')).toBe('beam');
        expect(figureIdOf('figure:rails')).toBe('rails');
        expect(figureIdOf('figure:tank')).toBe('tank');
        expect(figureIdOf('figure:circuit')).toBe('circuit');
        expect(figureIdOf('figure:pipeline')).toBe('pipeline');
        expect(figureIdOf('figure:gauge')).toBe('gauge');
        expect(figureIdOf('figure:scale')).toBe('scale');
    });

    it('ignores ordinary images and unknown figures', () => {
        expect(figureIdOf('/articles/x/foto.png')).toBeNull();
        expect(figureIdOf('figure:unknown')).toBeNull();
    });
});
