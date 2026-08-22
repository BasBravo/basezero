import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ArticleTitleBreadcrumb } from './ArticleTitleBreadcrumb';

describe('ArticleTitleBreadcrumb', () => {
    afterEach(() => vi.restoreAllMocks());

    it('aparece solo cuando el título principal sale por la parte superior', () => {
        let titleBottom = 120;
        let frameCallback: FrameRequestCallback | null = null;

        vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function getRect(this: Element) {
            const bottom = this.id === 'article-title' ? titleBottom : 0;
            return {
                bottom,
                height: 0,
                left: 0,
                right: 0,
                top: bottom,
                width: 0,
                x: 0,
                y: bottom,
                toJSON: () => ({}),
            };
        });
        vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
            frameCallback = callback;
            return 1;
        });

        const { container } = render(
            <>
                <h1 id="article-title">Mínimo no significa incompleto</h1>
                <ArticleTitleBreadcrumb
                    title="Mínimo no significa incompleto"
                    sectionLabel="Artículos"
                    sectionHref="/es#articles"
                    targetId="article-title"
                />
            </>,
        );
        const breadcrumb = container.querySelector('nav');

        expect(breadcrumb).toHaveAttribute('aria-hidden', 'true');
        expect(breadcrumb).not.toHaveAttribute('data-visible');

        titleBottom = -1;
        fireEvent.scroll(window);
        act(() => frameCallback?.(0));

        expect(breadcrumb).toHaveAttribute('aria-hidden', 'false');
        expect(breadcrumb).toHaveAttribute('data-visible', 'true');

        titleBottom = 40;
        fireEvent.scroll(window);
        act(() => frameCallback?.(16));

        expect(breadcrumb).toHaveAttribute('aria-hidden', 'true');
        expect(breadcrumb).not.toHaveAttribute('data-visible');
    });
});
