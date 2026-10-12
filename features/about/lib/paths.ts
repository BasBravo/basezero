export const aboutSlugByLocale = {
    es: 'sobre-mi',
    en: 'about',
} as const;

export type AboutLocale = keyof typeof aboutSlugByLocale;

export function getAboutPath(locale: AboutLocale) {
    return `/${locale}/${aboutSlugByLocale[locale]}`;
}
