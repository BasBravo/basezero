import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['es', 'en'],
    defaultLocale: 'es',
    localeDetection: true,
    localeCookie: {
        name: 'NEXT_LOCALE',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        path: '/',
    },
});
