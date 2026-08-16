export type ProjectStatus = 'active' | 'coming-soon';

export type Project = {
    id: string;
    name: string;
    description: string;
    logo?: string;
    url: string;
    status: ProjectStatus;
};

// Contenido migrado como recurso. La nueva interfaz decidirá después cómo presentarlo.
export const projects: Project[] = [
    {
        id: 'mappic',
        name: 'Mappic',
        description: 'Create your own map posters',
        logo: '/projects/mappic/logo-dark.svg',
        url: 'https://mappic.app/',
        status: 'active',
    },
    {
        id: 'typos',
        name: 'typos',
        description: 'A vector type studio for turning words into editable typographic systems.',
        url: 'https://typos.basezero.dev',
        status: 'active',
    },
    {
        id: 'mergeo',
        name: 'Mergeo',
        description: 'Visual GitHub portfolios for developers.',
        logo: '/projects/mergeo/logo.svg',
        url: 'https://mergeo.dev/',
        status: 'active',
    },
    {
        id: 'signado',
        name: 'Signado',
        description: 'Convierte tus vídeos en experiencias guiadas que escuchan, preguntan y se adaptan a cada persona.',
        logo: '/projects/signado/logo.png',
        url: 'https://signado.es/',
        status: 'active',
    },
    {
        id: 'telio',
        name: 'Telio',
        description: 'Telio',
        logo: '/projects/telio/logo-dark.svg',
        url: '#',
        status: 'coming-soon',
    },
    {
        id: 'recreo',
        name: 'Re_creo',
        description: 'Re_creo',
        logo: '/projects/recreo/logo-dark.svg',
        url: '#',
        status: 'coming-soon',
    },
];
