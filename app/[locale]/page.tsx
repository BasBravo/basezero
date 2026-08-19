import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getPortfolioProjects } from '@/content/portfolio-projects';
import { PortfolioExperience, type PortfolioCopy } from '@/features/portfolio/components/PortfolioExperience';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Portfolio');
    const projects = getPortfolioProjects(locale);
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
        menuContact: t('menu.contact'),
        scrollbar: t('scrollbar'),
        aboutTitle: t('about.title'),
        aboutParagraphs: [t('about.paragraphOne'), t('about.paragraphTwo'), t('about.paragraphThree')],
        servicesTitle: t('services.title'),
        servicesBody: t('services.body'),
        services: [
            { number: '01', title: t('services.launch.title'), body: t('services.launch.body') },
            { number: '02', title: t('services.transform.title'), body: t('services.transform.body') },
            { number: '03', title: t('services.evolve.title'), body: t('services.evolve.body') },
        ],
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

    return <PortfolioExperience copy={copy} projects={projects} />;
}
