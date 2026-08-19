export type PortfolioProject = {
    id: string;
    name: string;
    description: string;
    facets: string[];
    year: string;
    url: string;
    story: string[];
};

const projectsByLocale: Record<'es' | 'en', PortfolioProject[]> = {
    es: [
        {
            id: 'signado',
            name: 'Signado',
            description: 'Vídeo interactivo accesible que escucha, pregunta y se adapta a cada persona.',
            facets: ['Vídeo interactivo', 'Accesibilidad'],
            year: '2026',
            url: 'https://signado.es/',
            story: [
                'Signado explora cómo el vídeo puede dejar de ser un recorrido cerrado para convertirse en una conversación. En lugar de ofrecer el mismo contenido a todo el mundo, escucha respuestas y abre caminos distintos para cada persona.',
                'El producto reúne vídeo, preguntas y lógica adaptativa en una experiencia diseñada desde la accesibilidad. El resultado es una forma más cercana de acompañar, explicar y descubrir qué necesita cada usuario.',
            ],
        },
        {
            id: 'weform',
            name: 'WeForm',
            description: 'Una plataforma completa para crear experiencias de vídeo interactivas.',
            facets: ['Plataforma SaaS', 'IA'],
            year: '2026',
            url: 'https://weform.app/',
            story: [
                'WeForm nació para que crear experiencias de vídeo no lineales no exigiera encadenar herramientas ni sostener un proceso técnico difícil de mantener.',
                'Desde un único entorno se puede diseñar la estructura, configurar cada recorrido y publicar la experiencia. La IA se integra como parte del flujo de creación para hacer el proceso más ágil sin restarle control a quien crea.',
            ],
        },
        {
            id: 'mappic',
            name: 'Mappic',
            description: 'Mapas generativos convertidos en piezas gráficas personales.',
            facets: ['Diseño generativo', 'E-commerce'],
            year: '2025',
            url: 'https://mappic.app/',
            story: [
                'Mappic convierte un lugar importante en una pieza gráfica personal. La ciudad donde vives, un viaje o una coordenada concreta se transforman en una composición que conserva el vínculo con ese territorio.',
                'A partir de datos geográficos, el sistema genera mapas configurables y listos para convertirse en una pieza física. Tecnología y diseño trabajan juntos para que cada resultado sea reconocible y, al mismo tiempo, único.',
            ],
        },
        {
            id: 'mergeo',
            name: 'Mergeo',
            description: 'Portfolios visuales construidos directamente desde la actividad de GitHub.',
            facets: ['Herramienta para developers', 'Datos'],
            year: '2025',
            url: 'https://mergeo.dev/',
            story: [
                'Mergeo parte de una idea sencilla: la actividad de GitHub ya contiene buena parte de la historia profesional de una persona, aunque un perfil técnico no siempre consiga contarla con claridad.',
                'La herramienta interpreta la información pública y la convierte en un portfolio visual listo para compartir. Los datos siguen siendo la materia prima, pero se ordenan para dar protagonismo al trabajo y a la trayectoria.',
            ],
        },
        {
            id: 'typos',
            name: 'typos',
            description: 'Un estudio de tipografía vectorial para convertir palabras en sistemas editables.',
            facets: ['Herramienta creativa', 'Tipografía'],
            year: '2026',
            url: 'https://typos.basezero.dev',
            story: [
                'typos lleva la experimentación tipográfica a un espacio inmediato y accesible. Una palabra deja de ser texto estático y se convierte en una materia visual que se puede deformar, ordenar y explorar.',
                'Desde el navegador, cada composición se construye como un sistema vectorial editable. La herramienta reduce la distancia entre probar una idea y encontrar una forma con carácter propio.',
            ],
        },
    ],
    en: [
        {
            id: 'signado',
            name: 'Signado',
            description: 'Accessible interactive video that listens, asks and adapts to each person.',
            facets: ['Interactive video', 'Accessibility'],
            year: '2026',
            url: 'https://signado.es/',
            story: [
                'Signado explores how video can move beyond a closed, linear format and become a conversation. Instead of giving everyone the same content, it listens to responses and opens different paths for each person.',
                'The product brings together video, questions and adaptive logic in an experience designed around accessibility. The result is a more human way to guide, explain and understand what each user needs.',
            ],
        },
        {
            id: 'weform',
            name: 'WeForm',
            description: 'A complete platform for building interactive video experiences.',
            facets: ['SaaS platform', 'AI'],
            year: '2026',
            url: 'https://weform.app/',
            story: [
                'WeForm was created so building non-linear video experiences would no longer mean stitching together separate tools or maintaining a fragile technical process.',
                'One environment holds the structure, every path and the publishing flow. AI is woven into the creative process to make it faster while keeping the creator firmly in control.',
            ],
        },
        {
            id: 'mappic',
            name: 'Mappic',
            description: 'Generative maps transformed into personal graphic pieces.',
            facets: ['Generative design', 'E-commerce'],
            year: '2025',
            url: 'https://mappic.app/',
            story: [
                'Mappic turns a meaningful place into a personal graphic piece. A hometown, a journey or a precise coordinate becomes a composition that keeps its connection to that territory.',
                'Built from geographic data, the system generates configurable maps ready to become physical objects. Technology and design work together so every result feels recognisable and, at the same time, unique.',
            ],
        },
        {
            id: 'mergeo',
            name: 'Mergeo',
            description: 'Visual portfolios built directly from GitHub activity.',
            facets: ['Developer tool', 'Data'],
            year: '2025',
            url: 'https://mergeo.dev/',
            story: [
                'Mergeo begins with a simple idea: GitHub activity already contains much of a developer’s professional story, even if a technical profile does not always tell it clearly.',
                'The tool interprets public information and turns it into a visual portfolio that is ready to share. Data remains the raw material, but it is shaped to bring the work and the journey to the foreground.',
            ],
        },
        {
            id: 'typos',
            name: 'typos',
            description: 'A vector type studio for turning words into editable typographic systems.',
            facets: ['Creative tool', 'Typography'],
            year: '2026',
            url: 'https://typos.basezero.dev',
            story: [
                'typos brings typographic experimentation into an immediate, accessible space. A word stops being static text and becomes visual material that can be distorted, arranged and explored.',
                'In the browser, every composition is built as an editable vector system. The tool shortens the distance between trying an idea and finding a form with a character of its own.',
            ],
        },
    ],
};

export function getPortfolioProjects(locale: string) {
    return projectsByLocale[locale === 'es' ? 'es' : 'en'];
}
