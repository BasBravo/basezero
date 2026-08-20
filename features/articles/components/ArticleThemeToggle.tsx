'use client';

import { Moon, Sun } from 'lucide-react';
import styles from './article.module.css';

export function ArticleThemeToggle({ label }: { label: string }) {
    function toggleTheme() {
        const currentTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = nextTheme;
        document.documentElement.style.colorScheme = nextTheme;

        try {
            window.localStorage.setItem('basezero-theme', nextTheme);
        } catch {
            // The preference still applies to the current page.
        }
    }

    return (
        <button className={styles.themeToggle} type="button" onClick={toggleTheme} aria-label={label}>
            <Sun className={styles.themeIconLight} aria-hidden="true" strokeWidth={1.5} />
            <Moon className={styles.themeIconDark} aria-hidden="true" strokeWidth={1.5} />
        </button>
    );
}
