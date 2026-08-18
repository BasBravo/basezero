import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PortfolioScrollbar } from './PortfolioScrollbar';

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

describe('PortfolioScrollbar', () => {
    beforeEach(() => {
        mockDocumentScroll(5000, 1000, 0);
    });

    afterEach(() => {
        delete document.documentElement.dataset.customScrollbar;
        vi.restoreAllMocks();
    });

    it('expone un control accesible de posición', () => {
        render(<PortfolioScrollbar label="Posición de la página" />);

        const slider = screen.getByRole('slider', { name: 'Posición de la página' });
        expect(slider).toHaveAttribute('aria-orientation', 'vertical');
        expect(document.documentElement.dataset.customScrollbar).toBe('true');
    });

    it('permite recorrer la página con el teclado', async () => {
        const user = userEvent.setup();
        render(<PortfolioScrollbar label="Posición de la página" />);

        const slider = screen.getByRole('slider', { name: 'Posición de la página' });
        slider.focus();
        await user.keyboard('{End}');

        expect(document.documentElement.scrollTop).toBe(4000);
        expect(slider).toHaveAttribute('aria-valuenow', '100');
    });

    it('arrastra el scroll al mover el puntero sobre las líneas', () => {
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            bottom: 400,
            right: 40,
            width: 40,
            height: 400,
            toJSON: () => ({}),
        });

        render(<PortfolioScrollbar label="Posición de la página" />);
        const slider = screen.getByRole('slider', { name: 'Posición de la página' });

        fireEvent.pointerDown(slider, { button: 0, clientY: 100 });
        expect(document.documentElement.scrollTop).toBe(1000);

        fireEvent.pointerMove(window, { clientY: 200 });
        expect(document.documentElement.scrollTop).toBe(2000);
        expect(slider).toHaveAttribute('data-dragging', 'true');

        fireEvent.pointerUp(window);
        expect(slider).not.toHaveAttribute('data-dragging');
    });

    it('arrastra el scroll con eventos táctiles nativos', () => {
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            bottom: 400,
            right: 40,
            width: 40,
            height: 400,
            toJSON: () => ({}),
        });

        render(<PortfolioScrollbar label="Posición de la página" />);
        const slider = screen.getByRole('slider', { name: 'Posición de la página' });
        const firstTouch = { identifier: 7, clientY: 100 };
        const movedTouch = { identifier: 7, clientY: 300 };

        fireEvent.touchStart(slider, { changedTouches: [firstTouch], touches: [firstTouch] });
        expect(document.documentElement.scrollTop).toBe(1000);

        fireEvent.touchMove(window, { changedTouches: [movedTouch], touches: [movedTouch] });
        expect(document.documentElement.scrollTop).toBe(3000);

        fireEvent.touchEnd(window, { changedTouches: [movedTouch], touches: [] });
        expect(slider).not.toHaveAttribute('data-dragging');
    });
});
