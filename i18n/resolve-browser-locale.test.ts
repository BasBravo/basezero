import { describe, expect, it } from 'vitest';
import { readLocaleCookie, resolveBrowserLocale } from './resolve-browser-locale';

const locales = ['es', 'en'];

describe('resolveBrowserLocale', () => {
    it('prioriza el idioma guardado en la cookie', () => {
        expect(resolveBrowserLocale(['es-ES'], locales, 'es', 'en')).toBe('en');
    });

    it('usa el idioma del navegador cuando está soportado', () => {
        expect(resolveBrowserLocale(['en-US', 'en'], locales, 'es')).toBe('en');
        expect(resolveBrowserLocale(['es-MX'], locales, 'es')).toBe('es');
    });

    it('cae al idioma por defecto si el navegador no coincide', () => {
        expect(resolveBrowserLocale(['fr-FR', 'de'], locales, 'es')).toBe('es');
    });
});

describe('readLocaleCookie', () => {
    it('lee el valor de NEXT_LOCALE', () => {
        expect(readLocaleCookie('theme=dark; NEXT_LOCALE=en', 'NEXT_LOCALE')).toBe('en');
        expect(readLocaleCookie('session=1', 'NEXT_LOCALE')).toBeNull();
    });
});
