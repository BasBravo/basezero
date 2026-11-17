import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ogImageOf, pageMetadata } from '@/features/seo/lib/metadata';

export async function projectsIndexMetadata(locale: string): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'Portfolio' });
    const index = await getTranslations({ locale, namespace: 'ProjectsIndex' });
    return pageMetadata({
        locale,
        path: locale === 'es' ? '/es/proyectos' : '/en/projects',
        title: index('metaTitle'),
        description: t('work.body'),
        languages: { es: '/es/proyectos', en: '/en/projects' },
        image: ogImageOf(locale, 'home'),
    });
}
