'use client';

import { Icon } from '@/components/ui/icon';
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
            <Icon name="light_mode" className={styles.themeIconLight} />
            <Icon name="dark_mode" className={styles.themeIconDark} />
        </button>
    );
}
