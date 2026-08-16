export function resolveBrowserLocale(
    languages: readonly string[],
    locales: readonly string[],
    defaultLocale: string,
    cookieLocale?: string | null,
) {
    if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

    for (const language of languages) {
        const normalized = language.trim().toLowerCase();
        if (!normalized) continue;
        if (locales.includes(normalized)) return normalized;

        const languageCode = normalized.split('-')[0];
        if (languageCode && locales.includes(languageCode)) return languageCode;
    }

    return defaultLocale;
}

export function readLocaleCookie(cookieHeader: string, cookieName: string) {
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${cookieName}=([^;]*)`));
    return match?.[1] ? decodeURIComponent(match[1]) : null;
}
