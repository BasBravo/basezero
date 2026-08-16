'use client';

import { useEffect } from 'react';
import { readLocaleCookie, resolveBrowserLocale } from '@/i18n/resolve-browser-locale';
import { routing } from '@/i18n/routing';

export default function RootPage() {
    useEffect(() => {
        const cookieName = typeof routing.localeCookie === 'object' && routing.localeCookie.name
            ? routing.localeCookie.name
            : 'NEXT_LOCALE';
        const languages = [...navigator.languages, navigator.language].filter(
            (language): language is string => Boolean(language),
        );
        const locale = resolveBrowserLocale(
            languages,
            routing.locales,
            routing.defaultLocale,
            readLocaleCookie(document.cookie, cookieName),
        );
        window.location.replace(`/${locale}`);
    }, []);

    return null;
}
