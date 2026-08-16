import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
    PortfolioExperience,
    type PortfolioCopy,
    type PortfolioProject,
} from '@/features/portfolio/components/PortfolioExperience';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Portfolio');
    const isSpanish = locale === 'es';
    const projects: PortfolioProject[] = [
        {
            id: 'signado',
            name: 'Signado',
            description: isSpanish
                ? 'Vídeo interactivo accesible que escucha, pregunta y se adapta a cada persona.'
                : 'Accessible interactive video that listens, asks and adapts to each person.',
            discipline: 'Product · Full-stack',
            year: '2026',
            url: 'https://signado.es/',
        },
        {
            id: 'weform',
            name: 'WeForm',
            description: isSpanish
                ? 'Una plataforma completa para crear experiencias de vídeo interactivas.'
                : 'A complete platform for building interactive video experiences.',
            discipline: 'Platform · AI-first',
            year: '2026',
            url: 'https://weform.app/',
        },
        {
            id: 'mappic',
            name: 'Mappic',
            description: isSpanish
                ? 'Mapas generativos convertidos en piezas gráficas personales.'
                : 'Generative maps transformed into personal graphic pieces.',
            discipline: 'Product · Generative',
            year: '2025',
            url: 'https://mappic.app/',
        },
        {
            id: 'mergeo',
            name: 'Mergeo',
            description: isSpanish
                ? 'Portfolios visuales construidos directamente desde la actividad de GitHub.'
                : 'Visual portfolios built directly from GitHub activity.',
            discipline: 'Product · Development',
            year: '2025',
            url: 'https://mergeo.dev/',
        },
        {
            id: 'typos',
            name: 'typos',
            description: isSpanish
                ? 'Un estudio de tipografía vectorial para convertir palabras en sistemas editables.'
                : 'A vector type studio for turning words into editable typographic systems.',
            discipline: 'Tool · Typography',
            year: '2026',
            url: 'https://typos.basezero.dev',
        },
    ];
    const copy: PortfolioCopy = {
        locale,
        navWork: t('navWork'),
        workTitle: t('work.title'),
        workBody: t('work.body'),
        introTitle: t('intro.title'),
        introBody: t('intro.body'),
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
        farewellTitle: t('farewell.title'),
        farewellBody: t('farewell.body'),
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
