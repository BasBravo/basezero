import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
    title: 'Página no encontrada — Basezero',
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <html lang="es" data-theme="dark">
            <body style={{ display: 'grid', minHeight: '100svh', placeContent: 'center', gap: '1rem', padding: '1.5rem', textAlign: 'center' }}>
                <h1>Página no encontrada · Page not found</h1>
                <p>
                    <Link href="/es">Ir a Basezero</Link> · <Link href="/en">Go to Basezero</Link>
                </p>
            </body>
        </html>
    );
}
