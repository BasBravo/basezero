import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PortfolioProject } from '@/content/portfolio-projects';
import { ProjectDialog } from './ProjectDialog';

const project: PortfolioProject = {
    id: 'test',
    name: 'Test product',
    description: 'A concise product description.',
    discipline: 'Product · Full-stack',
    year: '2026',
    url: 'https://example.com/',
    challenge: 'A meaningful challenge.',
    solution: 'A focused solution.',
    contribution: ['Product strategy', 'Design and development'],
};

const copy = {
    close: 'Close project',
    challenge: 'The challenge',
    solution: 'The solution',
    contribution: 'My contribution',
    visit: 'Open live product',
};

describe('ProjectDialog', () => {
    beforeEach(() => {
        Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
            configurable: true,
            value() {
                this.setAttribute('open', '');
            },
        });
        Object.defineProperty(HTMLDialogElement.prototype, 'close', {
            configurable: true,
            value() {
                this.removeAttribute('open');
                this.dispatchEvent(new Event('close'));
            },
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('muestra el contexto del proyecto y enlaza al producto real', () => {
        render(<ProjectDialog project={project} copy={copy} onClose={vi.fn()} />);

        expect(screen.getByRole('dialog')).toHaveAttribute('open');
        expect(screen.getByRole('heading', { name: 'Test product' })).toBeVisible();
        expect(screen.getByRole('heading', { name: 'The challenge' })).toBeVisible();
        expect(screen.getByText('Design and development')).toBeVisible();
        expect(screen.getByRole('link', { name: 'Open live product' })).toHaveAttribute(
            'href',
            'https://example.com/',
        );
    });

    it('cierra el diálogo desde el control visible', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<ProjectDialog project={project} copy={copy} onClose={onClose} />);

        await user.click(screen.getByRole('button', { name: 'Close project' }));

        expect(onClose).toHaveBeenCalledOnce();
    });

    it('permite cerrar con Escape mediante el evento cancel nativo', () => {
        const onClose = vi.fn();
        render(<ProjectDialog project={project} copy={copy} onClose={onClose} />);

        fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));

        expect(onClose).toHaveBeenCalledOnce();
    });
});
