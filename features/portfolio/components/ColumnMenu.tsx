'use client';

import { Menu, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import styles from './portfolio.module.css';

export type ColumnMenuItem = {
    href: string;
    label: string;
};

type ColumnMenuToggleProps = {
    open: boolean;
    openLabel: string;
    closeLabel: string;
    onToggle: () => void;
};

type ColumnMenuPanelProps = {
    open: boolean;
    label: string;
    items: ColumnMenuItem[];
    onNavigate: () => void;
};

export function ColumnMenuToggle({ open, openLabel, closeLabel, onToggle }: ColumnMenuToggleProps) {
    return (
        <button
            className={styles.menuToggle}
            type="button"
            aria-expanded={open}
            aria-controls="column-menu"
            aria-label={open ? closeLabel : openLabel}
            onClick={onToggle}
        >
            {open
                ? <X aria-hidden="true" strokeWidth={2.25} />
                : <Menu aria-hidden="true" strokeWidth={2.25} />}
        </button>
    );
}

export function ColumnMenuPanel({ open, label, items, onNavigate }: ColumnMenuPanelProps) {
    const onNavigateRef = useRef(onNavigate);

    useEffect(() => {
        onNavigateRef.current = onNavigate;
    }, [onNavigate]);

    useEffect(() => {
        if (!open) return;

        let closeTimer = 0;

        function scheduleClose() {
            if (closeTimer) return;
            closeTimer = window.setTimeout(() => {
                onNavigateRef.current();
            }, 200);
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') onNavigateRef.current();
        }

        window.addEventListener('scroll', scheduleClose, { passive: true });
        window.addEventListener('wheel', scheduleClose, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.clearTimeout(closeTimer);
            window.removeEventListener('scroll', scheduleClose);
            window.removeEventListener('wheel', scheduleClose);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open]);

    return (
        <nav
            id="column-menu"
            className={styles.columnMenu}
            data-open={open ? 'true' : undefined}
            aria-hidden={!open}
            aria-label={label}
            {...(!open ? { inert: true } : {})}
        >
            <ul className={styles.columnMenuList}>
                {items.map((item) => (
                    <li className={styles.columnMenuItem} key={item.href}>
                        <a
                            className={styles.columnMenuLink}
                            href={item.href}
                            onClick={(event) => {
                                if (item.href === '#top') {
                                    event.preventDefault();
                                    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                                    window.history.replaceState(null, '', '#top');
                                    window.scrollTo({
                                        top: 0,
                                        left: 0,
                                        behavior: reducedMotion ? 'auto' : 'smooth',
                                    });
                                }
                                onNavigate();
                            }}
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
