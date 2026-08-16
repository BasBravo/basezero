import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';

const projectRoot = resolve(import.meta.dirname, '..');
const legacyRoot = resolve(projectRoot, process.argv[2] ?? '../front');

const mapping = {
    NUXT_APP_URL: 'NEXT_PUBLIC_SITE_URL',
    NUXT_APP_NAME: 'NEXT_PUBLIC_APP_NAME',
    NUXT_APP_DESCRIPTION: 'NEXT_PUBLIC_APP_DESCRIPTION',
    NUXT_PROVIDER_DATA: 'NEXT_PUBLIC_PROVIDER_DATA',
    NUXT_APP_KEY: 'NEXT_PUBLIC_FIREBASE_API_KEY',
    NUXT_AUTH_DOMAIN: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    NUXT_PROJECT_ID: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    NUXT_STORAGE_BUCKET: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    NUXT_MESSAGING_SENDER_ID: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    NUXT_APP_ID: 'NEXT_PUBLIC_FIREBASE_APP_ID',
    NUXT_MEASUREMENT_ID: 'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
    NUXT_STORAGE_URL: 'NEXT_PUBLIC_STORAGE_URL',
    NUXT_FUNCTIONS_URL: 'NEXT_PUBLIC_FUNCTIONS_URL',
    NUXT_AUTH_URL: 'NEXT_PUBLIC_AUTH_URL',
    NUXT_GOOGLE_GTAG_ID: 'NEXT_PUBLIC_GOOGLE_GTAG_ID',
    NUXT_MAPBOX_API_KEY: 'NEXT_PUBLIC_MAPBOX_API_KEY',
    NUXT_STRIPE_PUBLIC_KEY: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    NUXT_STRIPE_SECRET_KEY: 'STRIPE_SECRET_KEY',
    NUXT_CRYPTO_KEY: 'CRYPTO_KEY',
};

function serialize(value) {
    return JSON.stringify(String(value));
}

async function migrate(sourceName, targetName) {
    const sourcePath = resolve(legacyRoot, sourceName);
    if (!existsSync(sourcePath)) {
        throw new Error(`No existe el entorno de origen: ${sourcePath}`);
    }

    const source = parseEnv(await readFile(sourcePath, 'utf8'));
    const lines = ['# Generado desde el frontend Nuxt. No versionar.', ''];

    for (const [legacyKey, nextKey] of Object.entries(mapping)) {
        if (source[legacyKey] !== undefined) lines.push(`${nextKey}=${serialize(source[legacyKey])}`);
    }

    const targetPath = resolve(projectRoot, targetName);
    await writeFile(targetPath, `${lines.join('\n')}\n`, { mode: 0o600 });
    console.log(`Creado ${targetName}`);
}

await migrate('.env.dev', '.env.development.local');
await migrate('.env.prod', '.env.production.local');
