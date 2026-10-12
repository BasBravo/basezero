'use client';

import { useSyncExternalStore, type ReactNode } from 'react';

function subscribe(onChange: () => void) {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
}

const themeOf = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export function IsoTheme({ children }: { children: ReactNode }) {
    const theme = useSyncExternalStore(subscribe, themeOf, () => 'dark');
    return (
        <div className="iso" data-theme={theme}>
            {children}
        </div>
    );
}
