import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AboutRoute } from '@/features/about/components/AboutRoute';
import { buildAboutMetadata } from '@/features/about/lib/about-seo';

const locale = 'es';

export const dynamicParams = false;

export function generateStaticParams() {
    return [{ locale }];
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'About' });
    return buildAboutMetadata(locale, t('meta.title'), t('meta.description'));
}

export default function AboutRoutePage() {
    return <AboutRoute locale={locale} />;
}
