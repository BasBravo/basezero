import { getAboutPath, type AboutLocale } from '@/features/about/lib/paths';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://basezero.dev';
export const siteName = 'Basezero';
export const authorName = 'Bas Bravo';
export const contactEmail = 'hello@basezero.dev';
export const xHandle = '@basbravo_';

/** Stable ids so every page describes the same studio, site and person in its structured data. */
export const ids = {
    organization: `${siteUrl}/#organization`,
    website: `${siteUrl}/#website`,
    person: `${siteUrl}/#bas-bravo`,
};

export const socialProfiles = [
    { label: 'GitHub', handle: '@BasBravo', href: 'https://github.com/BasBravo' },
    { label: 'X', handle: xHandle, href: 'https://x.com/basbravo_' },
    { label: 'Instagram', handle: '@bas.bravo', href: 'https://www.instagram.com/bas.bravo/' },
    { label: 'Behance', handle: '@basbravo', href: 'https://www.behance.net/basbravo' },
];

export const openGraphLocale = { es: 'es_ES', en: 'en_US' } as const;
export const htmlLanguage = { es: 'es-ES', en: 'en' } as const;

export const asLocale = (locale: string): AboutLocale => (locale === 'en' ? 'en' : 'es');
export const absolute = (path: string) => `${siteUrl}${path}`;
export const aboutUrl = (locale: string) => absolute(getAboutPath(asLocale(locale)));

/** The social preview generated for each page, see app/og. */
export const ogImageOf = (locale: string, name: string) => ({
    url: absolute(`/og/${asLocale(locale)}/${name}.png`),
    width: 1200,
    height: 630,
});

/** The plain-Markdown copy of an article, written for AI agents and readers that prefer text. */
export const articleMarkdownPath = (locale: string, slug: string) => `/${locale}/articulos/md/${slug}.md`;

/** What the studio offers, in the words a client would search for. Shared by the structured data and llms.txt. */
export const services = {
    es: [
        { name: 'Desarrollo de MVP', description: 'Definición, diseño y desarrollo de una primera versión completa, lista para personas reales.' },
        { name: 'Diseño y desarrollo de producto digital', description: 'Estrategia, experiencia, interfaz y desarrollo de aplicaciones web y plataformas SaaS de principio a fin.' },
        { name: 'Desarrollo AI-first', description: 'Producto y código construidos con la IA en el núcleo del proceso, y funciones de IA integradas en el producto.' },
        { name: 'Herramientas web a medida', description: 'Herramientas internas y paneles para equipos, conectadas con los sistemas que ya usan.' },
    ],
    en: [
        { name: 'MVP development', description: 'Strategy, design and development of a complete first version, ready for real people.' },
        { name: 'Digital product design and development', description: 'Strategy, experience, interface and development of web apps and SaaS platforms from end to end.' },
        { name: 'AI-first development', description: 'Product and code built with AI at the core of the process, and AI features built into the product.' },
        { name: 'Custom web tools', description: 'Internal tools and dashboards for teams, connected to the systems they already use.' },
    ],
} as const;

export const expertise = ['MVP', 'SaaS', 'Product design', 'Web development', 'AI-first development', 'Next.js', 'React', 'TypeScript', 'Firebase', 'Accessibility'];
