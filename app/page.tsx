import type { Metadata } from 'next';
import { siteUrl } from '@/features/seo/lib/site';
import { routing } from '@/i18n/routing';
import './globals.css';

const target = `/${routing.defaultLocale}`;

// Firebase Hosting already answers / with a 301 to /es; this page is the fallback without JavaScript.
export const metadata: Metadata = {
    title: 'Basezero',
    robots: { index: false, follow: true },
    alternates: { canonical: `${siteUrl}${target}` },
};

export default function RootPage() {
    return (
        <html lang="es" data-theme="dark">
            <body>
                <meta httpEquiv="refresh" content={`0; url=${target}`} />
                <a href={target}>Basezero</a>
            </body>
        </html>
    );
}
