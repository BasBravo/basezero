import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPortfolioProjects } from '@/content/portfolio-projects';
import { getArticleSummaries } from '@/features/articles/lib/articles';
import { PortfolioExperience, type PortfolioCopy } from '@/features/portfolio/components/PortfolioExperience';
import { getAboutPath } from '@/features/about/lib/paths';
import { routing } from '@/i18n/routing';
import { ogImageOf, pageMetadata } from '@/features/seo/lib/metadata';

export function generateStaticParams() {
    return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Portfolio' });
    return pageMetadata({
        locale,
        path: `/${locale}`,
        title: t('meta.title'),
        description: t('meta.description'),
        languages: { es: '/es', en: '/en' },
        image: ogImageOf(locale, 'home'),
    });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Portfolio');
    const projects = getPortfolioProjects(locale);
    const articles = getArticleSummaries(locale);
    const copy: PortfolioCopy = {
        locale,
        navWork: t('navWork'),
        workTitle: t('work.title'),
        workBody: t('work.body'),
        introTitle: t('intro.title'),
        introBody: t('intro.body'),
        introViewWork: t('intro.viewWork'),
        openProject: t('openProject'),
        contactAction: t('contactAction'),
        themeToggle: t('themeToggle'),
        menuOpen: t('menu.open'),
        menuClose: t('menu.close'),
        menuLabel: t('menu.label'),
        menuHome: t('menu.home'),
        menuWork: t('menu.work'),
        menuAbout: t('menu.about'),
        menuArticles: t('menu.articles'),
        menuContact: t('menu.contact'),
        menuMe: t('menu.me'),
        aboutMeLink: t('about.meLink'),
        aboutMeHref: getAboutPath(locale === 'es' ? 'es' : 'en'),
        scrollbar: t('scrollbar'),
        aboutTitle: t('about.title'),
        aboutParagraphs: [t('about.paragraphOne'), t('about.paragraphTwo'), t('about.paragraphThree')],
        articlesTitle: t('articles.title'),
        articlesBody: t('articles.body'),
        readArticle: t('articles.read'),
        farewellTitle: t('farewell.title'),
        farewellBody: t('farewell.body'),
        copyEmail: t('farewell.copyEmail'),
        emailCopied: t('farewell.emailCopied'),
        projectDialogClose: t('projectDialog.close'),
        projectDialogVisit: t('projectDialog.visit'),
        processLabel: t('processLabel'),
        processSteps: [
            { number: '01', title: t('processSteps.understand.title'), body: t('processSteps.understand.body') },
            { number: '02', title: t('processSteps.shape.title'), body: t('processSteps.shape.body') },
            { number: '03', title: t('processSteps.launch.title'), body: t('processSteps.launch.body') },
            { number: '04', title: t('processSteps.learn.title'), body: t('processSteps.learn.body') },
            { number: '05', title: t('processSteps.grow.title'), body: t('processSteps.grow.body') },
        ],
    };

    return <PortfolioExperience copy={copy} projects={projects} articles={articles} />;
}
