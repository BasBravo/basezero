export const publicEnvironment = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Basezero',
    appDescription:
        process.env.NEXT_PUBLIC_APP_DESCRIPTION ??
        'A space to build, learn, and ship software—where ideas grow from zero',
    storageUrl: process.env.NEXT_PUBLIC_STORAGE_URL,
    functionsUrl: process.env.NEXT_PUBLIC_FUNCTIONS_URL,
    authUrl: process.env.NEXT_PUBLIC_AUTH_URL,
    mapboxApiKey: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
    gtagId: process.env.NEXT_PUBLIC_GOOGLE_GTAG_ID,
} as const;
