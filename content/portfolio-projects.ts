export type PortfolioProject = {
    id: string;
    name: string;
    description: string;
    facets: string[];
    year: string;
    url: string;
    story: string[];
    /** The case study page for this project, when there is one. */
    caseStudyHref?: string;
};

const projectsByLocale: Record<'es' | 'en', PortfolioProject[]> = {
    es: [
        {
            id: 'signado',
            name: 'Signado',
            description: 'Trámites completos en lengua de signos para que las personas sordas los terminen solas.',
            facets: ['Plataforma SaaS', 'Accesibilidad'],
            year: '2026',
            url: 'https://signado.es/',
            story: [
                'Signado convierte un trámite escrito en un recorrido interactivo en lengua de signos. Cada paso es un vídeo signado por una persona real: explica, pregunta, y la respuesta decide el siguiente paso hasta que el trámite termina.',
                'Se abre desde un QR o un enlace, sin instalar nada ni registrarse, y está construido sobre el motor de Weform. Las personas sordas signantes participan en cada decisión del producto.',
            ],
        },
        {
            id: 'weform',
            name: 'Weform',
            description: 'Una plataforma completa para crear experiencias de vídeo interactivas.',
            facets: ['Plataforma SaaS', 'IA'],
            year: '2026',
            url: 'https://weform.app/',
            story: [
                'Weform es una plataforma completa para crear experiencias de vídeo interactivas. Nació para que construir recorridos no lineales no exigiera encadenar herramientas ni sostener un proceso técnico difícil de mantener.',
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
                'Mappic convierte mapas generativos en piezas gráficas personales. Un lugar importante —la ciudad donde vives, un viaje o una coordenada concreta— se transforma en una composición que conserva el vínculo con ese territorio.',
                'A partir de datos geográficos, el sistema genera mapas configurables y listos para convertirse en una pieza física. Tecnología y diseño trabajan juntos para que cada resultado sea reconocible y, al mismo tiempo, único.',
            ],
        },
        {
            id: 'simplish',
            name: 'Simplish',
            description: 'Pequeñas herramientas para el trabajo que mantiene en marcha una empresa.',
            facets: ['Herramienta para equipos', 'Operaciones'],
            year: '2026',
            url: 'https://simplish.work/',
            story: [
                'Simplish reúne pequeñas herramientas para las tareas que mantienen en marcha una empresa: personas, altas y bajas, software, accesos y recordatorios. Nace de una observación sencilla: esas tareas invisibles se comen el día de los equipos pequeños, y casi nadie las eligió.',
                'Cada herramienta hace un solo trabajo y lo hace bien, todas conectadas y bajo una única suscripción. La idea es entrar, resolver lo pendiente y seguir con tu día. Está en construcción, con acceso anticipado abierto.',
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
                'typos es un estudio de tipografía vectorial para convertir palabras en sistemas editables. Lleva la experimentación tipográfica a un espacio inmediato y accesible: una palabra deja de ser texto estático y se convierte en una materia visual que se puede deformar, ordenar y explorar.',
                'Desde el navegador, cada composición se construye como un sistema vectorial editable. La herramienta reduce la distancia entre probar una idea y encontrar una forma con carácter propio.',
            ],
        },
    ],
    en: [
        {
            id: 'signado',
            name: 'Signado',
            description: 'Whole processes in sign language, so deaf people can complete them on their own.',
            facets: ['SaaS platform', 'Accessibility'],
            year: '2026',
            url: 'https://signado.es/',
            story: [
                'Signado turns a written process into an interactive journey in sign language. Each step is a video signed by a real person: it explains, asks, and the answer decides the next step until the process is done.',
                'It opens from a QR code or a link, with nothing to install and no sign-up, and it is built on the Weform engine. Deaf signers take part in every product decision.',
            ],
        },
        {
            id: 'weform',
            name: 'Weform',
            description: 'A complete platform for building interactive video experiences.',
            facets: ['SaaS platform', 'AI'],
            year: '2026',
            url: 'https://weform.app/',
            story: [
                'Weform is a complete platform for building interactive video experiences. It was created so constructing non-linear paths would no longer mean stitching together separate tools or maintaining a fragile technical process.',
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
                'Mappic turns generative maps into personal graphic pieces. A meaningful place — a hometown, a journey or a precise coordinate — becomes a composition that keeps its connection to that territory.',
                'Built from geographic data, the system generates configurable maps ready to become physical objects. Technology and design work together so every result feels recognisable and, at the same time, unique.',
            ],
        },
        {
            id: 'simplish',
            name: 'Simplish',
            description: 'Small tools for the work that keeps a company running.',
            facets: ['Team tool', 'Operations'],
            year: '2026',
            url: 'https://simplish.work/',
            story: [
                'Simplish brings together small tools for the jobs that keep a company running: people, arrivals and exits, software, access and reminders. It starts from a simple observation: that invisible work eats the day of small teams, and almost nobody chose it.',
                'Each tool does one job and does it well, all connected under a single subscription. The aim is to come in, get the pending things done and get on with your day. It is under construction, with early access open.',
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
                'typos is a vector type studio for turning words into editable typographic systems. It brings typographic experimentation into an immediate, accessible space: a word stops being static text and becomes visual material that can be distorted, arranged and explored.',
                'In the browser, every composition is built as an editable vector system. The tool shortens the distance between trying an idea and finding a form with a character of its own.',
            ],
        },
    ],
};

export function getPortfolioProjects(locale: string) {
    return projectsByLocale[locale === 'es' ? 'es' : 'en'];
}
