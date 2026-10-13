import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ogImageOf, pageMetadata } from '@/features/seo/lib/metadata';
import { aboutUrl } from '@/features/seo/lib/site';
import { caseStudyGraph, jsonLd } from '@/features/seo/lib/structured-data';
import { getCaseStudy, getCaseStudySummaries } from '../lib/case-studies';
import { getCaseStudyMarkdownPath, getCaseStudyPath, type CaseStudyLocale } from '../lib/paths';
import { CaseStudyPage } from './CaseStudyPage';

export function caseStudyMetadata(locale: CaseStudyLocale, slug: string): Metadata {
    const study = getCaseStudy(locale, slug);
    if (!study) notFound();
    const metadata = pageMetadata({
        locale,
        path: study.href,
        title: `${study.title} — Basezero`,
        description: study.description,
        languages: getCaseStudy(locale === 'es' ? 'en' : 'es', slug) ? { es: getCaseStudyPath('es', slug), en: getCaseStudyPath('en', slug) } : undefined,
        image: { ...ogImageOf(locale, `caso-${slug}`), alt: study.title },
        types: { 'text/markdown': getCaseStudyMarkdownPath(locale, slug) },
        openGraph: { type: 'article', title: study.title, modifiedTime: study.date, tags: study.keywords, authors: [aboutUrl(locale)] },
    });
    return { ...metadata, keywords: study.keywords };
}

export async function CaseStudyRoute({ locale, slug }: { locale: CaseStudyLocale; slug: string }) {
    setRequestLocale(locale);
    const study = getCaseStudy(locale, slug);
    if (!study) notFound();
    const [t, articleT, portfolioT] = await Promise.all([
        getTranslations({ locale, namespace: 'CaseStudy' }),
        getTranslations({ locale, namespace: 'Article' }),
        getTranslations({ locale, namespace: 'Portfolio' }),
    ]);
    const others = getCaseStudySummaries(locale).filter(other => other.slug !== slug);

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(caseStudyGraph(study)) }} />
            <CaseStudyPage
                study={study}
                others={others}
                copy={{
                    skip: t('skip'),
                    homeLabel: articleT('homeLabel'),
                    backToWork: t('backToWork'),
                    themeToggle: articleT('themeToggle'),
                    scrollbar: portfolioT('scrollbar'),
                    detailsLabel: t('detailsLabel'),
                    projectLabel: t('projectLabel'),
                    yearLabel: t('yearLabel'),
                    roleLabel: t('roleLabel'),
                    typeLabel: t('typeLabel'),
                    stackLabel: t('stackLabel'),
                    visit: t('visit', { name: study.name }),
                    otherProjects: t('otherProjects'),
                    sourcesLabel: articleT('sourcesLabel'),
                    footnoteBack: articleT('footnoteBack'),
                    menuOpen: portfolioT('menu.open'),
                    menuClose: portfolioT('menu.close'),
                    menuLabel: portfolioT('menu.label'),
                    menuHome: portfolioT('menu.home'),
                    menuWork: portfolioT('menu.work'),
                    menuArticles: portfolioT('menu.articles'),
                    menuAbout: portfolioT('menu.about'),
                    menuContact: portfolioT('menu.contact'),
                    menuMe: portfolioT('menu.me'),
                }}
            />
        </>
    );
}
