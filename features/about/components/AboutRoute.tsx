import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPortfolioProjects } from '@/content/portfolio-projects';
import { getCaseStudySlugs } from '@/features/case-studies/lib/case-studies';
import { getCaseStudyPath } from '@/features/case-studies/lib/paths';
import { buildAboutStructuredData, aboutSocialLinks, contactEmail } from '../lib/about-seo';
import type { AboutLocale } from '../lib/paths';
import { AboutPage, type AboutPageCopy } from './AboutPage';

export async function AboutRoute({ locale }: { locale: AboutLocale }) {
    setRequestLocale(locale);
    const [t, portfolioT] = await Promise.all([
        getTranslations({ locale, namespace: 'About' }),
        getTranslations({ locale, namespace: 'Portfolio' }),
    ]);

    const copy: AboutPageCopy = {
        skip: t('skip'),
        homeLabel: t('homeLabel'),
        backToStudio: t('backToStudio'),
        detailsLabel: t('detailsLabel'),
        themeToggle: portfolioT('themeToggle'),
        scrollbar: portfolioT('scrollbar'),
        title: t('title'),
        lead: t('lead'),
        role: t('role'),
        studio: t('studio'),
        portraitAlt: t('portraitAlt'),
        intro: t.raw('intro') as string[],
        doTitle: t('do.title'),
        doItems: t.raw('do.items') as AboutPageCopy['doItems'],
        pathTitle: t('path.title'),
        pathIntro: t('path.intro'),
        pathItems: t.raw('path.items') as AboutPageCopy['pathItems'],
        howTitle: t('how.title'),
        howQuote: t('how.quote'),
        howItems: t.raw('how.items') as AboutPageCopy['howItems'],
        workTitle: t('work.title'),
        workBody: t('work.body'),
        workVisit: t('work.visit'),
        workCaseStudy: t('work.caseStudy'),
        stackTitle: t('stack.title'),
        stackBody: t('stack.body'),
        stackGroups: t.raw('stack.groups') as AboutPageCopy['stackGroups'],
        contactTitle: t('contact.title'),
        contactBody: t('contact.body'),
        contactAction: t('contact.action'),
        menuOpen: portfolioT('menu.open'),
        menuClose: portfolioT('menu.close'),
        menuLabel: portfolioT('menu.label'),
        menuHome: portfolioT('menu.home'),
        menuWork: portfolioT('menu.work'),
        menuArticles: portfolioT('menu.articles'),
        menuAbout: portfolioT('menu.about'),
        menuContact: portfolioT('menu.contact'),
        menuMe: portfolioT('menu.me'),
    };

    const caseStudies = new Set(getCaseStudySlugs(locale));
    const structuredData = buildAboutStructuredData(locale, t('meta.title'), t('meta.description'), copy.role);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
                }}
            />
            <AboutPage
                locale={locale}
                copy={copy}
                projects={getPortfolioProjects(locale).map(project => (caseStudies.has(project.id) ? { ...project, caseStudyHref: getCaseStudyPath(locale, project.id) } : project))}
                socialLinks={aboutSocialLinks}
                email={contactEmail}
            />
        </>
    );
}
