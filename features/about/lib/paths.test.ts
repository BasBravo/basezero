import { describe, expect, it } from 'vitest';
import { getAboutPath } from './paths';

describe('about paths', () => {
    it('uses a localized slug per locale', () => {
        expect(getAboutPath('es')).toBe('/es/sobre-mi');
        expect(getAboutPath('en')).toBe('/en/about');
    });
});
