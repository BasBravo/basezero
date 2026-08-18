export type PortfolioProject = {
    id: string;
    name: string;
    description: string;
    discipline: string;
    year: string;
    url: string;
    challenge: string;
    solution: string;
    contribution: string[];
};

const projectsByLocale: Record<'es' | 'en', PortfolioProject[]> = {
    es: [
        {
            id: 'signado',
            name: 'Signado',
            description: 'Vídeo interactivo accesible que escucha, pregunta y se adapta a cada persona.',
            discipline: 'Producto · Full-stack',
            year: '2026',
            url: 'https://signado.es/',
            challenge: 'El vídeo tradicional ofrece el mismo recorrido a todo el mundo y apenas permite escuchar o responder a las necesidades de cada persona.',
            solution: 'Una experiencia de vídeo accesible e interactiva que combina contenido, preguntas y recorridos adaptativos para acompañar a cada usuario.',
            contribution: ['Estrategia de producto', 'Diseño de interacción', 'Desarrollo full-stack'],
        },
        {
            id: 'weform',
            name: 'WeForm',
            description: 'Una plataforma completa para crear experiencias de vídeo interactivas.',
            discipline: 'Plataforma · IA',
            year: '2026',
            url: 'https://weform.app/',
            challenge: 'Crear una experiencia de vídeo no lineal suele exigir herramientas separadas y un proceso técnico difícil de mantener.',
            solution: 'Una plataforma unificada para diseñar, configurar y publicar experiencias de vídeo interactivas desde un mismo entorno.',
            contribution: ['Arquitectura de producto', 'Experiencia de creación', 'Desarrollo e integración de IA'],
        },
        {
            id: 'mappic',
            name: 'Mappic',
            description: 'Mapas generativos convertidos en piezas gráficas personales.',
            discipline: 'Producto · Diseño generativo',
            year: '2025',
            url: 'https://mappic.app/',
            challenge: 'Convertir un lugar significativo en una pieza gráfica personal sin depender de herramientas de cartografía o diseño profesional.',
            solution: 'Un producto que transforma datos geográficos en composiciones visuales configurables y preparadas para convertirse en una pieza física.',
            contribution: ['Concepto de producto', 'Sistema visual generativo', 'Desarrollo de la experiencia'],
        },
        {
            id: 'mergeo',
            name: 'Mergeo',
            description: 'Portfolios visuales construidos directamente desde la actividad de GitHub.',
            discipline: 'Producto · Desarrollo',
            year: '2025',
            url: 'https://mergeo.dev/',
            challenge: 'La actividad de GitHub contiene la historia profesional de un desarrollador, pero un perfil técnico no siempre la convierte en una presentación clara.',
            solution: 'Una herramienta que interpreta la actividad pública y la convierte en un portfolio visual listo para compartir.',
            contribution: ['Definición de producto', 'Integración con GitHub', 'Diseño y desarrollo'],
        },
        {
            id: 'typos',
            name: 'typos',
            description: 'Un estudio de tipografía vectorial para convertir palabras en sistemas editables.',
            discipline: 'Herramienta · Tipografía',
            year: '2026',
            url: 'https://typos.basezero.dev',
            challenge: 'Explorar formas tipográficas expresivas suele requerir software complejo y un conocimiento técnico que interrumpe la experimentación.',
            solution: 'Una herramienta visual que convierte palabras en composiciones vectoriales editables y permite explorar sistemas tipográficos desde el navegador.',
            contribution: ['Concepto y dirección visual', 'Interacción vectorial', 'Desarrollo de la herramienta'],
        },
    ],
    en: [
        {
            id: 'signado',
            name: 'Signado',
            description: 'Accessible interactive video that listens, asks and adapts to each person.',
            discipline: 'Product · Full-stack',
            year: '2026',
            url: 'https://signado.es/',
            challenge: 'Traditional video gives everyone the same path and offers little room to listen or respond to each person’s needs.',
            solution: 'An accessible interactive video experience that combines content, questions and adaptive paths to guide each user.',
            contribution: ['Product strategy', 'Interaction design', 'Full-stack development'],
        },
        {
            id: 'weform',
            name: 'WeForm',
            description: 'A complete platform for building interactive video experiences.',
            discipline: 'Platform · AI',
            year: '2026',
            url: 'https://weform.app/',
            challenge: 'Building a non-linear video experience usually requires separate tools and a technical process that is hard to maintain.',
            solution: 'A unified platform for designing, configuring and publishing interactive video experiences from one environment.',
            contribution: ['Product architecture', 'Creator experience', 'Development and AI integration'],
        },
        {
            id: 'mappic',
            name: 'Mappic',
            description: 'Generative maps transformed into personal graphic pieces.',
            discipline: 'Product · Generative design',
            year: '2025',
            url: 'https://mappic.app/',
            challenge: 'Turning a meaningful place into a personal graphic piece normally requires professional mapping or design tools.',
            solution: 'A product that transforms geographic data into configurable visual compositions ready to become a physical piece.',
            contribution: ['Product concept', 'Generative visual system', 'Experience development'],
        },
        {
            id: 'mergeo',
            name: 'Mergeo',
            description: 'Visual portfolios built directly from GitHub activity.',
            discipline: 'Product · Development',
            year: '2025',
            url: 'https://mergeo.dev/',
            challenge: 'GitHub activity contains a developer’s professional story, but a technical profile does not always turn it into a clear presentation.',
            solution: 'A tool that interprets public activity and turns it into a visual portfolio that is ready to share.',
            contribution: ['Product definition', 'GitHub integration', 'Design and development'],
        },
        {
            id: 'typos',
            name: 'typos',
            description: 'A vector type studio for turning words into editable typographic systems.',
            discipline: 'Tool · Typography',
            year: '2026',
            url: 'https://typos.basezero.dev',
            challenge: 'Exploring expressive letterforms often requires complex software and technical knowledge that gets in the way of experimentation.',
            solution: 'A visual tool that turns words into editable vector compositions and makes typographic systems explorable in the browser.',
            contribution: ['Concept and visual direction', 'Vector interaction', 'Tool development'],
        },
    ],
};

export function getPortfolioProjects(locale: string) {
    return projectsByLocale[locale === 'es' ? 'es' : 'en'];
}
