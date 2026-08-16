import { afterEach, describe, expect, it } from 'vitest';
import {
    getDocumentScrollProgress,
    hideNativeScrollbar,
    restoreNativeScrollbar,
    setDocumentScrollProgress,
} from './document-scroll';

function mockDocumentScroll(scrollHeight: number, innerHeight: number, scrollTop = 0) {
    let top = scrollTop;
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: innerHeight });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
        configurable: true,
        value: scrollHeight,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
        configurable: true,
        get: () => top,
        set: (value: number) => {
            top = value;
        },
    });
    Object.defineProperty(document, 'scrollingElement', {
        configurable: true,
        value: document.documentElement,
    });
}

describe('document-scroll', () => {
    afterEach(() => {
        restoreNativeScrollbar();
    });

    it('normaliza el progreso entre 0 y 1', () => {
        mockDocumentScroll(5000, 1000, 2000);
        expect(getDocumentScrollProgress()).toBeCloseTo(0.5);
    });

    it('escribe el progreso en el documento', () => {
        mockDocumentScroll(5000, 1000, 0);
        setDocumentScrollProgress(0.25);
        expect(document.documentElement.scrollTop).toBe(1000);
        expect(getDocumentScrollProgress()).toBeCloseTo(0.25);
    });

    it('oculta y restaura el scrollbar nativo', () => {
        hideNativeScrollbar();
        expect(document.documentElement.dataset.customScrollbar).toBe('true');
        restoreNativeScrollbar();
        expect(document.documentElement.dataset.customScrollbar).toBeUndefined();
    });
});
