import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ColumnMenuPanel, ColumnMenuToggle } from './ColumnMenu';

const items = [
    { href: '#top', label: 'Inicio' },
    { href: '#work', label: 'Proyectos' },
    { href: '#about', label: 'Estudio' },
    { href: '#contact', label: 'Contacto' },
];

function MenuHarness() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <ColumnMenuToggle
                open={open}
                openLabel="Abrir menú"
                closeLabel="Cerrar menú"
                onToggle={() => setOpen((current) => !current)}
            />
            <ColumnMenuPanel
                open={open}
                label="Secciones"
                items={items}
                onNavigate={() => setOpen(false)}
            />
        </>
    );
}

describe('ColumnMenu', () => {
    afterEach(() => {
        vi.useRealTimers();
    });
    it('abre el menú con las secciones y cambia a un botón de cierre', async () => {
        const user = userEvent.setup();
        render(<MenuHarness />);

        await user.click(screen.getByRole('button', { name: 'Abrir menú' }));

        expect(screen.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('navigation', { name: 'Secciones' })).toBeVisible();
        expect(screen.getByRole('link', { name: 'Proyectos' })).toHaveAttribute('href', '#work');
    });

    it('cierra el menú al elegir una sección', async () => {
        const user = userEvent.setup();
        render(<MenuHarness />);

        await user.click(screen.getByRole('button', { name: 'Abrir menú' }));
        await user.click(screen.getByRole('link', { name: 'Estudio' }));

        expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByRole('navigation', { name: 'Secciones' })).toBeNull();
    });

    it('cierra el menú tras un scroll breve', () => {
        vi.useFakeTimers();
        render(<MenuHarness />);

        fireEvent.click(screen.getByRole('button', { name: 'Abrir menú' }));
        fireEvent.wheel(window, { deltaY: 40 });

        expect(screen.getByRole('button', { name: 'Cerrar menú' })).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(200);
        });

        expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false');
    });
});
